import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { Gem, Heart, Award, Users } from "lucide-react"

export const metadata = {
  title: 'ჩვენს შესახებ | samkaulebi.shop',
  description: 'samkaulebi.shop — პრემიუმ სამკაულები, სუნამოები და თავის მოვლა. ჩვენი ისტორია.',
}

const values = [
  {
    icon: Gem,
    title: "პრემიუმ ხარისხი",
    desc: "ყოველი პროდუქტი გადის სერტიფიკაციას. მხოლოდ საუკეთესო."
  },
  {
    icon: Heart,
    title: "სიყვარულით დამზადებული",
    desc: "თითოეული სამკაული ირჩევა სიფრთხილით და ყურადღებით."
  },
  {
    icon: Award,
    title: "გარანტირებული",
    desc: "14 დღიანი დაბრუნების გარანტია ყველა პროდუქტზე."
  },
  {
    icon: Users,
    title: "1000+ კმაყოფილი მომხმარებელი",
    desc: "ჩვენი მომხმარებლების ნდობა ჩვენი ყველაზე ღირებული ჯილდოა."
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-card overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <span className="font-serif text-[30vw] font-bold text-foreground whitespace-nowrap leading-none select-none">
              beauty
            </span>
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">ჩვენს შესახებ</span>
          <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6 leading-tight">
            სილამაზე,<br />სტილი, ხარისხი.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            samkaulebi.shop დაფუძნდა ერთი მარტივი მიზნით — მოგიტანოთ პრემიუმ სამკაულები,
            სუნამოები და თავის მოვლის საშუალებები პირდაპირ სახლში, ზედმეტი ფასის გარეშე.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">ჩვენი ისტორია</span>
            <h2 className="font-serif text-4xl text-foreground mb-6">სტარტი 2023 წელს</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                2023 წელს გუნდი, ვისაც სამკაულებისა და სილამაზის სამყარო ყოველთვის გვიყვარდა, 
                გადავწყვიტეთ შეგვექმნა ერთი ადგილი სადაც ყველაფერი — ხარისხი, სტილი და ხელმისაწვდომობა — 
                ერთ სივრცეში იქნებოდა.
              </p>
              <p>
                დღეს samkaulebi.shop-ს 30-ზე მეტი პროდუქტი აქვს სამ კატეგორიაში — 
                სამკაულები, სუნამოები და თავის მოვლა — და ყოველდღიურად 1000-ზე მეტ მომხმარებელს ემსახურება.
              </p>
              <p>
                ყოველი საკეტი, ყოველი ბოთლი, ყოველი ბეჭედი — ჩვენი გარანტიით.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "30+", label: "პროდუქტი" },
              { num: "1000+", label: "მომხმარებელი" },
              { num: "3", label: "კატეგორია" },
              { num: "14", label: "დღიანი გარანტია" },
            ].map(({ num, label }) => (
              <div key={label} className="bg-card rounded-3xl p-6 text-center boty-shadow">
                <div className="font-serif text-4xl text-primary mb-2 font-bold">{num}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">ჩვენი ღირებულებები</span>
            <h2 className="font-serif text-4xl text-foreground">რაზე ვდგავართ</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-background rounded-3xl p-6 boty-shadow text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
