import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { AccountNav } from "@/components/account/account-nav"
import { ProfileForm } from "./profile-form"

export const dynamic = "force-dynamic"

export default async function AccountProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/account/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-serif text-3xl text-foreground mb-8">ჩემი ანგარიში</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <AccountNav />
            <div className="flex-1 max-w-md">
              <h2 className="font-medium text-foreground mb-4">პროფილი</h2>
              <ProfileForm
                initial={{
                  fullName: profile?.full_name ?? "",
                  phone: profile?.phone ?? "",
                  email: user.email ?? "",
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
