"use server"

import db from "@/lib/db"
import { getUser } from "@/lib/user"
import { UserSchema } from "@/lib/validations/user"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { UTApi } from "uploadthing/server"

export const updateProfilePicture = async function ({ url }: { url: string }) {
  const session = await getUser()
  const utapi = new UTApi()

  if (!session) return

  await db.user.update({
    where: {
      id: session.id,
    },
    data: {
      image: url,
    },
  })

  const currentCover = session.image
  const coverKey = currentCover?.split("/").pop()

  if (url && coverKey && currentCover?.startsWith("https://")) {
    await utapi.deleteFiles(coverKey)
  }

  revalidatePath(`/profile/${session.id}`, "page")
}

export const updateCoverPicture = async function ({ url }: { url: string }) {
  const session = await getUser()
  const utapi = new UTApi()

  if (!session) return

  console.log(url)

  await db.user.update({
    where: {
      id: session.id,
    },
    data: {
      cover: url,
    },
  })

  const currentCover = session.cover
  const coverKey = currentCover?.split("/").pop()

  if (url && coverKey && currentCover?.startsWith("https://")) {
    await utapi.deleteFiles(coverKey)
  }

  revalidatePath(`/profile/${session.id}`, "page")
}

export const updateUserInformation = async function (data: UserSchema) {
  const session = await getUser()

  if (!session) return

  await db.user.update({
    where: {
      id: session.id,
    },
    data: {
      username: data.username,
      name: data.name,
      relationshipStatus: data.relationshipStatus,
      address: data.address,
      bio: data.bio,
      birthDate: data.birthDate,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      website: data.website,
    },
  })

  revalidatePath("/edit-profile")
  redirect(`/profile/${session.id}`)
}
