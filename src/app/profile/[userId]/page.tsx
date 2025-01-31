import { getProfile } from "@/lib/queries"
import { getUser } from "@/lib/user"
import Profile from "../_components/profile"
import { redirect } from "next/navigation"
import { type UserProfile } from "@/types"
import { Suspense } from "react"
import ProfileSkeleton from "@/components/skeleton/profile-skeleton"
import TabsProfile from "../_components/tabs"
import About from "../_components/about"

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>
}) => {
  const { userId } = await params

  const user = await getUser()

  if (!user) redirect("/login")
  if (!userId) redirect("/")

  const profile = getProfile({ userId })

  return (
    <div className="col-span-full lg:col-span-9 xl:col-span-6">
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile
          userId={userId}
          profilePromise={profile as Promise<UserProfile>}
        />
      </Suspense>

      <TabsProfile userId={userId} isUserPost={user.id === userId}>
        <Suspense fallback={<div>loading...</div>}>
          <About profilePromise={profile as Promise<UserProfile>} />
        </Suspense>
      </TabsProfile>
    </div>
  )
}
export default ProfilePage
