-- =============================================================================
-- 20260529_finance_functions.sql
-- samkaulebi.shop — read-only financial reporting functions
-- =============================================================================
-- დანიშნულება:
--   ამ ფუნქციებს იძახებს (a) admin financial dashboard და (b) AI ბუღალტერი
--   (Gemini 2.5 Flash) function-calling tool-ებად. ყველა STABLE = read-only.
--
-- უსაფრთხოება:
--   იძახება service_role admin client-ით (RLS bypass). AI ვერ წერს raw SQL-ს —
--   მხოლოდ ამ named ფუნქციებს იძახებს განსაზღვრული პარამეტრებით.
--
-- SCHEMA ASSUMPTIONS (agent: დაამოწმე რეალურ schema-სთან, საჭიროებისას მოარგე):
--   orders(id, status, total numeric, created_at timestamptz, customer_email text)
--   order_items(order_id uuid, product_id text, price numeric, quantity int)
--   products(id text, name text, stock int, cost_price numeric)
--
-- VALID REVENUE STATUSES: 'confirmed','shipped','delivered'
--   (pending და cancelled არ ითვლება ბრუნვაში)
--
-- VAT: საქართველო 18%, ფასი VAT-inclusive (gross-ში შედის).
--   VAT owed = gross × rate/(1+rate);  net = gross/(1+rate)
--
-- ⚠️ COGS CAVEAT:
--   order_items-ს არ აქვს cost snapshot — COGS join-ით იღებს მიმდინარე
--   products.cost_price-ს. წაშლილი პროდუქტი (product_id NULL) → COGS 0.
--   ისტორიული სიზუსტისთვის რეკომენდებულია order-ის შექმნისას cost snapshot:
--     ALTER TABLE order_items ADD COLUMN cost_price numeric DEFAULT 0;
--   და get_profit/get_top_products-ში p.cost_price → oi.cost_price.
-- =============================================================================

-- 1. ჯამური ბრუნვა (gross, customer-paid total, incl. shipping/fees) -----------
create or replace function public.get_revenue(p_start timestamptz, p_end timestamptz)
returns numeric
language sql stable
set search_path = public
as $$
  select coalesce(sum(o.total), 0)::numeric
  from orders o
  where o.status in ('confirmed','shipped','delivered')
    and o.created_at >= p_start
    and o.created_at <  p_end;
$$;

-- 2. AOV — საშუალო შეკვეთის ღირებულება ----------------------------------------
create or replace function public.get_aov(p_start timestamptz, p_end timestamptz)
returns numeric
language sql stable
set search_path = public
as $$
  select coalesce(avg(o.total), 0)::numeric
  from orders o
  where o.status in ('confirmed','shipped','delivered')
    and o.created_at >= p_start
    and o.created_at <  p_end;
$$;

-- 3. მოგება — საქონლის gross profit (revenue − COGS) --------------------------
create or replace function public.get_profit(p_start timestamptz, p_end timestamptz)
returns table(revenue numeric, cogs numeric, net numeric)
language sql stable
set search_path = public
as $$
  select
    coalesce(sum(oi.price * oi.quantity), 0)::numeric                          as revenue,
    coalesce(sum(oi.quantity * coalesce(p.cost_price, 0)), 0)::numeric         as cogs,
    (coalesce(sum(oi.price * oi.quantity), 0)
       - coalesce(sum(oi.quantity * coalesce(p.cost_price, 0)), 0))::numeric   as net
  from order_items oi
  join orders   o on o.id = oi.order_id
  left join products p on p.id = oi.product_id
  where o.status in ('confirmed','shipped','delivered')
    and o.created_at >= p_start
    and o.created_at <  p_end;
$$;

-- 4. ტოპ პროდუქტები ბრუნვით ----------------------------------------------------
create or replace function public.get_top_products(
  p_start timestamptz, p_end timestamptz, p_limit int default 5
)
returns table(product_id text, name text, units bigint, revenue numeric)
language sql stable
set search_path = public
as $$
  select
    oi.product_id,
    coalesce(p.name, '(deleted product)')           as name,
    sum(oi.quantity)::bigint                         as units,
    sum(oi.price * oi.quantity)::numeric             as revenue
  from order_items oi
  join orders   o on o.id = oi.order_id
  left join products p on p.id = oi.product_id
  where o.status in ('confirmed','shipped','delivered')
    and o.created_at >= p_start
    and o.created_at <  p_end
  group by oi.product_id, p.name
  order by revenue desc
  limit greatest(p_limit, 1);
$$;

-- 5. დაბალი მარაგი -------------------------------------------------------------
create or replace function public.get_low_stock(p_threshold int default 5)
returns table(product_id text, name text, stock int)
language sql stable
set search_path = public
as $$
  select p.id, p.name, p.stock
  from products p
  where p.stock < p_threshold
  order by p.stock asc;
$$;

-- 6. შეკვეთების სტატისტიკა სტატუსების მიხედვით ----------------------------------
create or replace function public.get_order_stats(p_start timestamptz, p_end timestamptz)
returns table(status text, count bigint)
language sql stable
set search_path = public
as $$
  select o.status, count(*)::bigint
  from orders o
  where o.created_at >= p_start
    and o.created_at <  p_end
  group by o.status
  order by count desc;
$$;

-- 7. დღგ — გადასახდელი VAT (18%, inclusive) ------------------------------------
create or replace function public.get_vat_owed(
  p_start timestamptz, p_end timestamptz, p_rate numeric default 0.18
)
returns table(gross numeric, net numeric, vat numeric)
language sql stable
set search_path = public
as $$
  with g as (
    select coalesce(sum(o.total), 0)::numeric as gross
    from orders o
    where o.status in ('confirmed','shipped','delivered')
      and o.created_at >= p_start
      and o.created_at <  p_end
  )
  select
    g.gross,
    (g.gross / (1 + p_rate))::numeric                      as net,
    (g.gross - g.gross / (1 + p_rate))::numeric            as vat
  from g;
$$;

-- 8. Repeat purchase rate (%) --------------------------------------------------
-- ASSUMES orders.customer_email. თუ email არ გაქვს, შეცვალე customer_phone-ით.
create or replace function public.get_repeat_rate(p_start timestamptz, p_end timestamptz)
returns numeric
language sql stable
set search_path = public
as $$
  with customer_orders as (
    select o.customer_email as cust, count(*) as n
    from orders o
    where o.status in ('confirmed','shipped','delivered')
      and o.created_at >= p_start
      and o.created_at <  p_end
      and o.customer_email is not null
    group by o.customer_email
  )
  select case
    when count(*) = 0 then 0
    else round(100.0 * count(*) filter (where n > 1) / count(*), 2)
  end
  from customer_orders;
$$;

-- =============================================================================
-- გაშვება: Supabase SQL editor-ში ან migration-ად.
-- შემოწმება (მაგალითი):
--   select public.get_revenue(now() - interval '30 days', now());
--   select * from public.get_profit(now() - interval '30 days', now());
--   select * from public.get_top_products(now() - interval '30 days', now(), 5);
-- =============================================================================
