import { getUser } from "@/lib/user"
import * as React from "react"
import EditProfileForm from "./_components/edit-profile-form"
import { User } from "@/lib/generated/prisma"
import { redirect } from "next/navigation"

const EditProfile = async () => {
  const user = getUser()

  if (!user) redirect("/login")

  return (
    <div className="w-full">
      <React.Suspense fallback={<div>loading...</div>}>
        <EditProfileForm editProfilePromise={user as Promise<User>} />
      </React.Suspense>
    </div>
  )
}
export default EditProfile
