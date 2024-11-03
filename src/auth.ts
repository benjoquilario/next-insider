import NextAuth, { DefaultSession } from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import bcrypt from "bcrypt"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { users, accounts, sessions, verificationTokens } from "@/db/schema/auth"
import { eq } from "drizzle-orm"
import { credentialsValidator } from "@/lib/validations/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = credentialsValidator.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          if (!email || !password) return null

          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          })

          if (!user || !user?.password) return null

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          )

          if (!isPasswordCorrect) return null

          return {
            id: user.id,
            image: user.image,
            email: user.email,
            name: user.name,
          }
        }

        return null
      },
    }),
  ],
})
