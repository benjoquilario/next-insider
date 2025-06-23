"use client"

import * as React from "react"
import { AuthContext } from "@/components/contexts/auth-context"
import { User } from "@/generated/prisma"

export function useUser() {
  const context = React.useContext(AuthContext)

  if (context === null) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}

export function AuthProvider({
  children,
  userPromise,
}: {
  children: React.ReactNode
  userPromise: Promise<User | null>
}) {
  const initialUser = React.use(userPromise)
  const [session, setSession] = React.useState<User | null>(initialUser)

  React.useEffect(() => {
    setSession(initialUser)
  }, [initialUser])

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  )
}
