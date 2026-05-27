import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { ChevronDown } from "lucide-react"

export const metadata = {
  title: 'ხშირად დასმული კითხვები | samkaulebi.shop',
  description: 'პასუხები ყველაზე ხშირ კითხვებზე — მიწოდება, დაბრუნება, გადახდა.',
}

const faqs = [
  {
    q: "რამდენ დღეში ჩამოდის შეკვეთა?",
    a: "თბილისში მიწოდება ხდება 1-2 სამუშაო დღეში. რეგიონებში — 2-4 სამუშაო დღეში."
  },
  {
    q: "უფასოა კი მიწოდება?",
    a: "100₾-ზე მეტი შეკვეთისას მიწოდება სრულიად უფასოა. 100₾-ზე ნაკლებ შეკვეთაზე მიწოდების ღირებულება 5₾."
  },
  {
    q: "შეიძლება თუ არა პროდუქტის დაბრუნება?",
    a: "დიახ, შეიძლება. პროდუქტის შეძენიდან 14 დღის განმავლობაში, თუ ის გამოუყენებელია და ორიგინალ შეფუთვაშია."
  },
  {
    q: "რა გადახდის მეთოდები გაქვთ?",
    a: "ვიღებთ ყველა ძირითად საბანკო ბარათს (Visa, Mastercard, Amex), ასევე TBC Pay და Bank of Georgia Pay."
  },
  {
    q: "ნამდვილია კი სამკაულები?",
    a: "დიახ! ყველა ჩვენი სამკაული ატestershire სერტიფიცირებულია. ოქროს ნაკეთობები მოდის 585 ან 750 სინჯის ოქროსგან, ვერცხლის — 925 სინჯის."
  },
  {
    q: "შეიძლება კი სამკაულის ზომის შეცვლა?",
    a: "დიახ, ბეჭდების ზომის შეცვლა შეგვიძლია. დამატებითი ინფორმაციისთვის დაგვიკავშირდი."
  },
  {
    q: "სახალხო ბარათი გაქვთ?",
    a: "ამჟამად ვმუშავებთ სალოიალო პროგრამის შექმნაზე. მალე გამოვაცხადებთ!"
  },
  {
    q: "შემიძლია კი საჩუქრის შეფუთვის გამოწვევა?",
    a: "აბსოლუტურად! საჩუქრის შეფუთვა ხელმისაწვდომია ყველა შეკვეთაზე. Checkout-ში მონიშნე სასურველი ვარიანტი."
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">FAQ</span>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">ხშირი კითხვები</h1>
          <p className="text-lg text-muted-foreground">ყველაზე გავრცელებული კითხვები და პასუხები</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-card rounded-2xl boty-shadow overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                <span className="font-medium text-foreground pr-4">{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 group-open:rotate-180 boty-transition" />
              </summary>
              <div className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm border-t border-border/30 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-card rounded-3xl boty-shadow">
          <h2 className="font-serif text-2xl text-foreground mb-2">პასუხი ვერ იპოვე?</h2>
          <p className="text-muted-foreground mb-6 text-sm">დაგვიკავშირდი და ნებისმიერ კითხვაზე გიპასუხებთ</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 boty-shadow"
          >
            კონტაქტი
          </a>
        </div>
      </div>

      <Footer />
    </main>
  )
}
