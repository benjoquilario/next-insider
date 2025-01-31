import React from "react"
import Layout from "@/components/layout"
import Section from "@/components/section"
import type { Metadata } from "next"
import { capitalizeName } from "@/lib/utils"
import { getProfile } from "@/lib/queries"
import { getUser } from "@/lib/user"
import { UserProfile } from "@/types"

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    userId: string
  }>
}): Promise<Metadata | undefined> {
  const { userId } = await params

  const session = await getUser()

  if (!session) return

  const profile = (await getProfile({ userId })) as UserProfile

  if (!profile) return

  const title = profile.name
  const imageUrl = profile.image

  return {
    title: `${capitalizeName(title ?? "")}`,
    openGraph: {
      title: `@${capitalizeName(title ?? "")}`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/${userId}`,
      images: [
        {
          url: `${imageUrl}`,
          width: 600,
          height: 400,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `@${capitalizeName(title ?? "")}`,
      images: [
        {
          url: `${imageUrl}`,
          width: 600,
          height: 400,
        },
      ],
    },
  }
}

const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <Section>{children}</Section>
    </Layout>
  )
}

export default ProfileLayout
