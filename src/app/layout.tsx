import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { getUser } from "@/lib/user"
import { AuthProvider } from "@/lib/auth"
import QueryProvider from "@/components/contexts/query-provider"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Insider",
  description:
    "A Fullstack social media application intended to make a community, friends, and make the world more open and connected.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userPromise = getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>
          <AuthProvider userPromise={userPromise}>
            <QueryProvider>
              {children}

              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </Suspense>

        <ThemeProvider />
      </body>
    </html>
  )
}
