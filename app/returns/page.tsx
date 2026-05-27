import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import Link from "next/link"
import { RotateCcw, CheckCircle, XCircle, Clock, Phone, ChevronRight, Shield } from "lucide-react"

export const metadata = {
  title: 'დაბრუნება და გაცვლა | samkaulebi.shop',
  description: '14-დღიანი დაბრუნების გარანტია. მარტივი და სწრაფი პროცესი.',
}

const returnable = [
  "პროდუქტი სრულ მდგომარეობაშია, გამოუყენებელი",
  "შეფუთვა არ არის დაზიანებული",
  "ყიდვიდან 14 კალენდარული დღე არ გასულა",
  "ჩეკი ან შეკვეთის ნომერი გაქვს",
]

const notReturnable = [
  "გამოყენებული ან დაზიანებული პროდუქტი",
  "14 დღის გასვლის შემდეგ",
  "სპეციალური შეკვეთა (custom/personalized)",
  "გახსნილი სუნამოები ან კოსმეტიკა (ჰიგიენის მიზეზით)",
]

const steps = [
  {
    step: "1",
    title: "დაგვიკავშირდი",
    desc: "დაგვირეკე ან მოგვწერე ელ-ფოსტაზე. მოგვაწოდე შეკვეთის ნომერი და დაბრუნების მიზეზი.",
  },
  {
    step: "2",
    title: "დადასტურება",
    desc: "ჩვენი გუნდი 24 საათში გადაამოწმებს და დაადასტურებს დაბრუნების მოთხოვნას.",
  },
  {
    step: "3",
    title: "გამოგზავნა",
    desc: "პროდუქტი ჩვენს მისამართზე გამოგზავნე ორიგინალ შეფუთვაში.",
  },
  {
    step: "4",
    title: "თანხის დაბრუნება",
    desc: "პროდუქტის მიღებიდან 3–5 სამუშაო დღეში თანხა ბრუნდება.",
  },
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">მთავარი</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">დაბრუნება და გაცვლა</span>
          </nav>

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <RotateCcw className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">დაბრუნება და გაცვლა</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              14-დღიანი გარანტია — თუ კმაყოფილი არ ხარ, ვაბრუნებთ თანხას
            </p>
          </div>

          {/* Guarantee Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-14 flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground mb-1">14-დღიანი გარანტია</h2>
              <p className="text-sm text-muted-foreground">
                თუ შეძენილი პროდუქტი არ გაგახარა ან პრობლემა გამოაჩნდა — ყიდვიდან 14 დღის განმავლობაში
                უქვითრო თანხის დაბრუნება ან გაცვლა გარანტირებულია.
              </p>
            </div>
          </div>

          {/* What can / can't be returned */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-foreground mb-6">რა ბრუნდება?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-foreground">ბრუნდება</h3>
                </div>
                <ul className="space-y-2.5">
                  {returnable.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h3 className="font-semibold text-foreground">არ ბრუნდება</h3>
                </div>
                <ul className="space-y-2.5">
                  {notReturnable.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-foreground mb-6">დაბრუნების პროცესი</h2>
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

          {/* Timing */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-foreground mb-6">თანხის დაბრუნების ვადა</h2>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-foreground mb-1">ნაღდი ფული / კურიერი</h3>
                    <p className="text-sm text-muted-foreground">3–5 სამუშაო დღე პროდუქტის მიღებიდან</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">ბანკის გადარიცხვა</h3>
                    <p className="text-sm text-muted-foreground">5–7 სამუშაო დღე</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="font-serif text-2xl text-foreground mb-2">დაბრუნება გინდა?</h2>
            <p className="text-muted-foreground mb-5 text-sm">დაგვიკავშირდი — 24 საათში გადავჭრით</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+995555000000"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                +995 555 000 000
              </a>
              <Link
                href="/contact"
                className="inline-block border border-border text-foreground px-8 py-3 rounded-full font-medium hover:bg-muted transition-colors text-sm"
              >
                კონტაქტის ფორმა
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
