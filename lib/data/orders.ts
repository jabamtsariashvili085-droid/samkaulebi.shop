// =============================================
// samkaulebi.shop - შეკვეთებისა და მომხმარებლების მონაცემები
// =============================================

import type { Order, Customer, DashboardStats } from './types'

// Mock მომხმარებლები
export const customers: Customer[] = [
  {
    id: 'cust-001',
    firstName: 'მარიამ',
    lastName: 'გელაშვილი',
    email: 'mariam.gelashvili@gmail.com',
    phone: '+995 555 123 456',
    address: {
      street: 'რუსთაველის გამზ. 12',
      city: 'თბილისი',
      postalCode: '0108',
      country: 'საქართველო'
    },
    createdAt: new Date('2024-01-05')
  },
  {
    id: 'cust-002',
    firstName: 'გიორგი',
    lastName: 'ბერიძე',
    email: 'giorgi.beridze@gmail.com',
    phone: '+995 555 234 567',
    address: {
      street: 'აღმაშენებლის ხეივანი 25',
      city: 'თბილისი',
      postalCode: '0112',
      country: 'საქართველო'
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'cust-003',
    firstName: 'ნინო',
    lastName: 'ქავთარაძე',
    email: 'nino.kavtaradze@gmail.com',
    phone: '+995 555 345 678',
    address: {
      street: 'ვაჟა-ფშაველას გამზ. 45',
      city: 'თბილისი',
      postalCode: '0186',
      country: 'საქართველო'
    },
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'cust-004',
    firstName: 'დავით',
    lastName: 'მაისურაძე',
    email: 'davit.maisuradze@gmail.com',
    phone: '+995 555 456 789',
    address: {
      street: 'წერეთლის გამზ. 89',
      city: 'ქუთაისი',
      postalCode: '4600',
      country: 'საქართველო'
    },
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'cust-005',
    firstName: 'თამარ',
    lastName: 'ჯაფარიძე',
    email: 'tamar.japaridze@gmail.com',
    phone: '+995 555 567 890',
    address: {
      street: 'ჭავჭავაძის გამზ. 33',
      city: 'ბათუმი',
      postalCode: '6010',
      country: 'საქართველო'
    },
    createdAt: new Date('2024-02-10')
  },
  {
    id: 'cust-006',
    firstName: 'ლუკა',
    lastName: 'წიკლაური',
    email: 'luka.tsiklauri@gmail.com',
    phone: '+995 555 678 901',
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'cust-007',
    firstName: 'ანა',
    lastName: 'ლომიძე',
    email: 'ana.lomidze@gmail.com',
    phone: '+995 555 789 012',
    address: {
      street: 'კოსტავას ქ. 77',
      city: 'თბილისი',
      postalCode: '0171',
      country: 'საქართველო'
    },
    createdAt: new Date('2024-02-20')
  },
  {
    id: 'cust-008',
    firstName: 'ნიკა',
    lastName: 'გოგოლაძე',
    email: 'nika.gogoladze@gmail.com',
    phone: '+995 555 890 123',
    createdAt: new Date('2024-03-01')
  }
]

// Mock შეკვეთები
export const orders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'SK-2024-0001',
    customer: customers[0],
    items: [
      {
        productId: 'ring-gold-classic',
        productName: 'ოქროს კლასიკური ბეჭედი',
        quantity: 1,
        price: 450,
        image: '/images/products/serum-bottles-1.png'
      },
      {
        productId: 'necklace-pearl',
        productName: 'მარგალიტის ყელსაბამი',
        quantity: 1,
        price: 320,
        image: '/images/products/spray-bottles.png'
      }
    ],
    status: 'delivered',
    subtotal: 770,
    shipping: 10,
    total: 780,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'ord-002',
    orderNumber: 'SK-2024-0002',
    customer: customers[1],
    items: [
      {
        productId: 'perfume-ocean-breeze',
        productName: 'Ocean Breeze',
        quantity: 2,
        price: 160,
        image: '/images/products/eye-serum-bottles.png'
      }
    ],
    status: 'delivered',
    subtotal: 320,
    shipping: 10,
    total: 330,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'ord-003',
    orderNumber: 'SK-2024-0003',
    customer: customers[2],
    items: [
      {
        productId: 'shampoo-repair',
        productName: 'აღმდგენი შამპუნი',
        quantity: 3,
        price: 28,
        image: '/images/products/pump-bottles-lavender.png'
      },
      {
        productId: 'oil-argan',
        productName: 'არგანის ზეთი',
        quantity: 1,
        price: 45,
        image: '/images/products/amber-dropper-bottles.png'
      }
    ],
    status: 'shipped',
    subtotal: 129,
    shipping: 5,
    total: 134,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-08')
  },
  {
    id: 'ord-004',
    orderNumber: 'SK-2024-0004',
    customer: customers[3],
    items: [
      {
        productId: 'bracelet-tennis',
        productName: 'ტენისის სამაჯური',
        quantity: 1,
        price: 1500,
        image: '/images/products/pump-bottles-lavender.png'
      }
    ],
    status: 'processing',
    subtotal: 1500,
    shipping: 15,
    total: 1515,
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28')
  },
  {
    id: 'ord-005',
    orderNumber: 'SK-2024-0005',
    customer: customers[4],
    items: [
      {
        productId: 'perfume-floral-dream',
        productName: 'Floral Dream',
        quantity: 1,
        price: 180,
        image: '/images/products/serum-bottles-1.png'
      },
      {
        productId: 'body-lotion-shea',
        productName: 'შეას კარაქის ლოსიონი',
        quantity: 2,
        price: 38,
        image: '/images/products/spray-bottles.png'
      }
    ],
    status: 'pending',
    subtotal: 256,
    shipping: 10,
    total: 266,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'ord-006',
    orderNumber: 'SK-2024-0006',
    customer: customers[5],
    items: [
      {
        productId: 'ring-engagement',
        productName: 'ნიშნობის ბეჭედი',
        quantity: 1,
        price: 1200,
        image: '/images/products/amber-dropper-bottles.png'
      }
    ],
    status: 'pending',
    subtotal: 1200,
    shipping: 15,
    total: 1215,
    notes: 'გრავირება: "M & L"',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: 'ord-007',
    orderNumber: 'SK-2024-0007',
    customer: customers[6],
    items: [
      {
        productId: 'earrings-diamond',
        productName: 'ბრილიანტის საყურეები',
        quantity: 1,
        price: 890,
        image: '/images/products/tube-bottles.png'
      },
      {
        productId: 'perfume-midnight-rose',
        productName: 'Midnight Rose',
        quantity: 1,
        price: 220,
        image: '/images/products/amber-dropper-bottles.png'
      }
    ],
    status: 'cancelled',
    subtotal: 1110,
    shipping: 10,
    total: 1120,
    notes: 'კლიენტის მოთხოვნით გაუქმებულია',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-06')
  },
  {
    id: 'ord-008',
    orderNumber: 'SK-2024-0008',
    customer: customers[7],
    items: [
      {
        productId: 'perfume-leather-wood',
        productName: 'Leather & Wood',
        quantity: 1,
        price: 195,
        image: '/images/products/cream-jars-colored.png'
      }
    ],
    status: 'shipped',
    subtotal: 195,
    shipping: 10,
    total: 205,
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-11')
  }
]

// შეკვეთის მიღება ID-ით
export function getOrderById(id: string): Order | undefined {
  return orders.find(o => o.id === id)
}

// შეკვეთის მიღება ნომრით
export function getOrderByNumber(orderNumber: string): Order | undefined {
  return orders.find(o => o.orderNumber === orderNumber)
}

// შეკვეთების მიღება სტატუსით
export function getOrdersByStatus(status: Order['status']): Order[] {
  return orders.filter(o => o.status === status)
}

// მომხმარებლის მიღება ID-ით
export function getCustomerById(id: string): Customer | undefined {
  return customers.find(c => c.id === id)
}

// Dashboard სტატისტიკა
export function getDashboardStats(): DashboardStats {
  const totalOrders = orders.length
  const deliveredOrders = orders.filter(o => o.status === 'delivered')
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0)
  
  return {
    totalOrders,
    totalRevenue,
    totalProducts: 28, // products.ts-დან
    totalCustomers: customers.length,
    ordersChange: 12.5, // წინა თვესთან შედარებით %
    revenueChange: 8.3,
    productsChange: 5.2,
    customersChange: 15.8
  }
}

// ბოლო შეკვეთები
export function getRecentOrders(limit: number = 5): Order[] {
  return [...orders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

// შეკვეთების სტატუსის სტატისტიკა
export function getOrderStatusStats() {
  return {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  }
}
