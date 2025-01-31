import { cookies } from "next/headers"
import { verifyToken } from "./auth/session"
import db from "./db"

export async function getUser() {
  const sessionCookie = (await cookies()).get("session")

  if (!sessionCookie || !sessionCookie.value) {
    return null
  }

  const sessionData = (await verifyToken(sessionCookie.value)) as any

  const { payload: data } = sessionData

  if (!data || !data.user) {
    return null
  }

  if (new Date(data.expires) < new Date()) {
    return null
  }

  const userId = data.user.id

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    return null
  }

  return user
}
