import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import Link from "next/link"
import { Truck, Clock, MapPin, Package, ChevronRight, CheckCircle } from "lucide-react"

export const metadata = {
  title: 'მიტანა | samkaulebi.shop',
  description: 'მიტანის პირობები და ვადები. უფასო მიტანა თბილისში.',
}

const shippingZones = [
  {
    zone: "თბილისი",
    price: "უფასო",
    time: "1–2 სამუშაო დღე",
    highlight: true,
  },
  {
    zone: "საქართველოს სხვა ქალაქები",
    price: "9₾",
    time: "2–4 სამუშაო დღე",
    highlight: false,
  },
  {
    zone: "მთიანი და შორეული რეგიონები",
    price: "12₾",
    time: "3–5 სამუშაო დღე",
    highlight: false,
  },
]

const steps = [
  { step: "1", title: "შეკვეთა", desc: "შეკვეთის განთავსების შემდეგ ვიღებთ დადასტურებას 2 საათში." },
  { step: "2", title: "დაფასოება", desc: "პროდუქტი ფრთხილად და ლამაზად ფასოვდება." },
  { step: "3", title: "გაგზავნა", desc: "კურიერი გამოდის მიმდინარე ან მომდევნო სამუშაო დღეს." },
  { step: "4", title: "მიტანა", desc: "კურიერი გაგიკავშირდება ჩამოსვლამდე." },
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">მთავარი</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">მიტანა</span>
          </nav>

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Truck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">მიტანის პირობები</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              სწრაფი და უსაფრთხო მიტანა საქართველოს მასშტაბით
            </p>
          </div>

          {/* Shipping Zones */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-foreground mb-6">მიტანის ზონები და ფასები</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {shippingZones.map(({ zone, price, time, highlight }) => (
                <div
                  key={zone}
                  className={`rounded-2xl p-6 border ${
                    highlight
                      ? "border-primary bg-primary/5"
                      : "border-border/50 bg-card"
                  }`}
                >
                  {highlight && (
                    <span className="text-xs font-medium text-primary uppercase tracking-wider block mb-2">პოპულარული</span>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <h3 className="font-medium text-foreground text-sm">{zone}</h3>
                  </div>
                  <p className={`text-2xl font-bold mb-1 ${highlight ? "text-primary" : "text-foreground"}`}>{price}</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Process Steps */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-foreground mb-6">მიტანის პროცესი</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map(({ step, title, desc }) => (
                <div key={step} className="bg-card rounded-2xl p-5 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-foreground mb-6">მნიშვნელოვანი ინფორმაცია</h2>
            <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-3">
              {[
                "შეკვეთები, განთავსებული 14:00 საათამდე, გაიგზავნება იმავე დღეს.",
                "შაბათ-კვირას გაგზავნა არ ხდება — შეკვეთები დამუშავდება ორშაბათს.",
                "კურიერი დაგიკავშირდება ჩამოსვლამდე 30 წუთით ადრე.",
                "თუ პირველ ზარზე არ პასუხობ, კურიერი 3-ჯერ სცდის.",
                "შეფუთვა მოიცავს სასაჩუქრე ყუთს და დამცავ მასალებს.",
                "პროდუქტი სრულად დაზღვეულია მიტანის დროს.",
              ].map(note => (
                <div key={note} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Packaging */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-foreground mb-6">შეფუთვა</h2>
            <div className="bg-card rounded-2xl p-6 border border-border/50 flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">პრემიუმ შეფუთვა</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ყველა შეკვეთა ფასოვდება ლამაზ სასაჩუქრე ყუთში ჩვენი ბრენდის ლოგოთი.
                  სამკაულები ინდივიდუალურ ბუშტებში ეხვევა. სუნამოები და კოსმეტიკა
                  სპეციალური დამცავი მასალით.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <h2 className="font-serif text-2xl text-foreground mb-3">კითხვა გაქვს?</h2>
            <p className="text-muted-foreground mb-5">ჩვენი გუნდი მზადაა დაგეხმაროს</p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              დაგვიკავშირდი
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
