"server-only"

import { compare, hash } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type User } from "@/generated/prisma"

const key = new TextEncoder().encode(process.env.AUTH_SECRET)
const SALT_ROUNDS = 12

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS)
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword)
}

type SessionData = {
  user: {
    id: string
  }
  expires: string
}

export async function signToken(payload: SessionData) {
  return new SignJWT({ payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key)
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload as SessionData
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value

  if (!session) return null

  return await verifyToken(session)
}

export async function setSession(user: User) {
  const expiresInOneDay = new Date(Date.now() + 1000 * 60 * 60 * 24)

  const session: SessionData = {
    user: { id: user.id! },
    expires: expiresInOneDay.toISOString(),
  }

  const encryptedSession = await signToken(session)

  ;(await cookies()).set("session", encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })
}
