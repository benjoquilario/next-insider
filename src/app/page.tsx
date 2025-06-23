import Layout from "@/components/layout"
import Section from "@/components/section"
import Link from "next/link"
import Posts from "@/components/posts"
import CreateButton from "@/components/posts/create-button"
import ThemeToggle from "@/components/theme-toggle"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
  description: `A Fullstack social media application intended to make a community, friends, and make the world more open and connected.`,
  alternates: {
    canonical: "/",
  },
}

const Home = () => {
  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          <div className="mb-1 flex flex-col items-center justify-between p-2">
            <div className="mb-3 flex w-full items-center justify-between">
              <Link href="/">
                <h1 className="text-3xl font-semibold">Feed</h1>
              </Link>
              <ThemeToggle />
            </div>

            <CreateButton />
            <Posts />
          </div>
        </div>
      </Section>
    </Layout>
  )
}
export default Home
