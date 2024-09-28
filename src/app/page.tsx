import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Layout from "@/components/layout"
import Posts from "@/components/posts"
import CreateButton from "@/components/posts/create-buttons"
import Section from "@/components/section"
import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (!session) redirect("/login")

  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          <div className="mb-1 flex items-center justify-between p-2">
            <Link href="/">
              <h1 className="text-3xl font-semibold">Feed</h1>
            </Link>
            <div>
              <ThemeToggle />
            </div>
          </div>
          <CreateButton />
          <Posts currentUserId={session.user.id} />
        </div>
      </Section>
    </Layout>
  )
}
