import { users } from "@/db/schema"
import { auth } from "@/auth"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { cache } from "react"

export const sessionAuth = cache(async () => {
  const session = await auth()
  if (!session) return null

  const userId = session.user.id

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  return currentUser
})

export const getCurrentUserById = async (userId: string) => {
  if (!userId) return null

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  return currentUser
}
