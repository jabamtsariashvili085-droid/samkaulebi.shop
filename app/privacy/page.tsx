import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import Link from "next/link"
import { ChevronRight, ShieldCheck } from "lucide-react"

export const metadata = {
  title: "კონფიდენციალურობის პოლიტიკა",
  description: "როგორ ვაგროვებთ, ვიყენებთ და ვიცავთ თქვენს პერსონალურ მონაცემებს samkaulebi.shop-ზე.",
}

const LAST_UPDATED = "2026 წლის 29 მაისი"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">მთავარი</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">კონფიდენციალურობა</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground">კონფიდენციალურობის პოლიტიკა</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-10">ბოლო განახლება: {LAST_UPDATED}</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">1. ზოგადი</h2>
              <p>
                samkaulebi.shop (შემდგომში — „ჩვენ" ან „მაღაზია") პატივს სცემს თქვენს კონფიდენციალურობას.
                ეს პოლიტიკა აღწერს, თუ რა პერსონალურ მონაცემებს ვაგროვებთ, რა მიზნით ვიყენებთ და როგორ ვიცავთ
                მათ. საიტით სარგებლობით თქვენ ეთანხმებით ამ პოლიტიკას.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">2. რა მონაცემებს ვაგროვებთ</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>შეკვეთის მონაცემები: სახელი, გვარი, ტელეფონი, ელ-ფოსტა, მისამართი, ქალაქი.</li>
                <li>შეკვეთის შინაარსი: შეძენილი პროდუქტები, რაოდენობა, თანხა.</li>
                <li>ტექნიკური მონაცემები: ბრაუზერი, მოწყობილობა, ანონიმური ანალიტიკა (გვერდის ნახვები).</li>
                <li>კალათის მონაცემები ინახება მხოლოდ თქვენს ბრაუზერში (localStorage).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">3. რა მიზნით ვიყენებთ</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>შეკვეთის დამუშავება, მიწოდება და მომხმარებლის მხარდაჭერა.</li>
                <li>გადახდის უსაფრთხო განხორციელება.</li>
                <li>საიტის გაუმჯობესება და სტატისტიკა (ანონიმურად).</li>
                <li>კანონით გათვალისწინებული ვალდებულებების შესრულება.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">4. მესამე მხარე დამმუშავებლები</h2>
              <p className="mb-3">თქვენი მონაცემების დასამუშავებლად ვიყენებთ შემდეგ სანდო სერვისებს:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><span className="text-foreground font-medium">Supabase</span> — მონაცემთა ბაზა (სერვერები ევროკავშირში, ირლანდია).</li>
                <li><span className="text-foreground font-medium">Cloudflare R2</span> — პროდუქტის სურათების შენახვა.</li>
                <li><span className="text-foreground font-medium">Vercel</span> — საიტის ჰოსტინგი და ანონიმური ანალიტიკა (cookie-ების გარეშე).</li>
                <li><span className="text-foreground font-medium">საქართველოს ბანკი (BOG)</span> — ონლაინ გადახდების დამუშავება (გააქtიურების შემდეგ).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">5. Cookies</h2>
              <p>
                ვიყენებთ მხოლოდ ფუნქციურ cookie-ებს (მაგ. ადმინ-სესია) და თქვენი ბრაუზერის localStorage-ს
                (კალათისთვის). მესამე მხარის სარეკლამო/თვალთვალის cookie-ებს არ ვიყენებთ.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">6. მონაცემთა შენახვა და უსაფრთხოება</h2>
              <p>
                მონაცემები ინახება დაცულ სერვერებზე და ვიყენებთ გონივრულ ტექნიკურ ზომებს მათი დასაცავად.
                შეკვეთის მონაცემებს ვინახავთ კანონით განსაზღვრული ვადით.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">7. თქვენი უფლებები</h2>
              <p>
                საქართველოს პერსონალურ მონაცემთა დაცვის კანონისა და GDPR-ის შესაბამისად, თქვენ გაქვთ უფლება
                მოითხოვოთ თქვენი მონაცემების ნახვა, შესწორება ან წაშლა. ამისთვის დაგვიკავშირდით.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">8. კონტაქტი</h2>
              <p>
                კითხვების შემთხვევაში მოგვწერეთ:{" "}
                <a href="mailto:info@samkaulebi.shop" className="text-primary underline underline-offset-2">info@samkaulebi.shop</a>{" "}
                ან გამოიყენეთ{" "}
                <Link href="/contact" className="text-primary underline underline-offset-2">კონტაქტის ფორმა</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
