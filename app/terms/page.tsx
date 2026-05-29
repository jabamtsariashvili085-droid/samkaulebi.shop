import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import Link from "next/link"
import { ChevronRight, FileText } from "lucide-react"

export const metadata = {
  title: "წესები და პირობები",
  description: "samkaulebi.shop-ით სარგებლობის წესები და პირობები — შეკვეთა, გადახდა, მიწოდება, დაბრუნება.",
}

const LAST_UPDATED = "2026 წლის 29 მაისი"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">მთავარი</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">წესები და პირობები</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground">წესები და პირობები</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-10">ბოლო განახლება: {LAST_UPDATED}</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">1. ზოგადი დებულებები</h2>
              <p>
                samkaulebi.shop-ით სარგებლობით თქვენ ეთანხმებით ამ წესებსა და პირობებს. თუ არ ეთანხმებით,
                გთხოვთ, არ ისარგებლოთ საიტით.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">2. პროდუქტები და ფასები</h2>
              <p>
                ყველა ფასი მითითებულია ქართულ ლარში (₾) და მოიცავს დღგ-ს. ვცდილობთ ფასებისა და პროდუქტის
                აღწერების სიზუსტეს, თუმცა ვიტოვებთ უფლებას შევცვალოთ ისინი წინასწარი გაფრთხილების გარეშე.
                პროდუქტის ხელმისაწვდომობა დამოკიდებულია მარაგზე.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">3. შეკვეთა</h2>
              <p>
                შეკვეთის გაფორმების შემდეგ მიიღებთ დადასტურებას. ვიტოვებთ უფლებას უარი ვთქვათ შეკვეთაზე
                მარაგის ამოწურვის, ფასის შეცდომის ან სხვა გონივრული მიზეზის გამო.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">4. გადახდა</h2>
              <p>
                გადახდა შესაძლებელია მიწოდებისას ნაღდი ანგარიშსწორებით, ხოლo ონლაინ-გადახდა ბარათით
                ხორციელდება საქართველოს ბანკის (BOG) უსაფრთხო სისტემის მეშვეობით (გააქტიურების შემდეგ).
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">5. მიწოდება</h2>
              <p>
                მიწოდების პირობები და ვადები აღწერილია{" "}
                <Link href="/shipping" className="text-primary underline underline-offset-2">მიწოდების</Link> გვერდზე.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">6. დაბრუნება და თანხის ანაზღაურება</h2>
              <p>
                მოქმედებს 14-დღიანი დაბრუნების გარანტია. დეტალური პირობები იხილეთ{" "}
                <Link href="/returns" className="text-primary underline underline-offset-2">დაბრუნების</Link> გვერდზე.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">7. ინტელექტუალური საკუთრება</h2>
              <p>
                საიტზე განთავსებული ყველა მასალა (ლოგო, ტექსტი, სურათები, დიზაინი) ეკუთვნის samkaulebi.shop-ს
                და დაცულია კანონით. მათი გამოყენება ნებართვის გარეშე აკრძალულია.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">8. პასუხისმგებლობის შეზღუდვა</h2>
              <p>
                მაღაზია არ აგებს პასუხს ირიბ ზიანზე, რომელიც გამოწვეულია საიტის ან პროდუქტის გამოყენებით,
                მოქმედი კანონმდებლობით დაშვებულ ფარგლებში.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">9. მოქმედი კანონმდებლობა</h2>
              <p>
                ამ წესებს არეგულირებს საქართველოს კანონმდებლობა. დავები წყდება საქართველოს სასამართლოების
                მეშვეობით.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">10. კონტაქტი</h2>
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
