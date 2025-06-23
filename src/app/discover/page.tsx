"use client"

import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { User, Gender, RelationshipStatus } from "@/generated/prisma"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"
import ThemeToggle from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"

// Helper to get age from birthDate
function getAge(birthDate: string | null | undefined) {
  if (!birthDate) return null
  const diff = Date.now() - new Date(birthDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

const genderOptions = ["MALE", "FEMALE"] as Gender[]
const relationshipOptions = [
  "SINGLE",
  "IN_A_RELATIONSHIP",
  "ENGAGED",
  "MARRIED",
] as RelationshipStatus[]

export default function DiscoverPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read filters from searchParams
  const gender = searchParams.get("gender") || ""
  const relationshipStatus = searchParams.get("relationshipStatus") || ""
  const minAge = searchParams.get("minAge") || ""
  const maxAge = searchParams.get("maxAge") || ""
  const name = searchParams.get("name") || ""

  // Debounce the name input
  const debouncedName = useDebounce(name, 300)

  // Update search params in URL
  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`?${params.toString()}`)
  }

  // Fetch users with filters
  const { data: users, isLoading } = useQuery({
    queryKey: [
      "discover-users",
      { gender, relationshipStatus, minAge, maxAge, debouncedName },
    ],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (gender) params.set("gender", gender)
      if (relationshipStatus)
        params.set("relationshipStatus", relationshipStatus)
      if (minAge) params.set("minAge", minAge)
      if (maxAge) params.set("maxAge", maxAge)
      if (debouncedName) params.set("name", debouncedName)
      const res = await fetch(`/api/discover?${params.toString()}`)
      return res.json()
    },
  })

  return (
    <div className="col-span-full lg:col-span-9 xl:col-span-6">
      <div className="mb-1 flex flex-col items-center justify-between p-2">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl font-semibold">Discover</h1>
          <ThemeToggle />
        </div>
      </div>

      {/* Filter Bar */}
      <motion.form
        layout
        className="bg-secondary/60 mb-6 flex flex-wrap gap-3 rounded-xl p-4 shadow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          placeholder="Search by name..."
          value={name}
          onChange={(e) => setParam("name", e.target.value)}
          className="w-40"
        />
        <Select
          defaultValue={gender || ""}
          onValueChange={(val) => setParam("gender", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={relationshipStatus || ""}
          onValueChange={(val) => setParam("relationshipStatus", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Relationship" />
          </SelectTrigger>
          <SelectContent>
            {relationshipOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          min={0}
          placeholder="Min Age"
          value={minAge}
          onChange={(e) => setParam("minAge", e.target.value)}
          className="w-24"
        />
        <Input
          type="number"
          min={0}
          placeholder="Max Age"
          value={maxAge}
          onChange={(e) => setParam("maxAge", e.target.value)}
          className="w-24"
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.replace("/discover")}
          className="ml-auto"
        >
          Reset
        </Button>
      </motion.form>

      {/* User Results */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                className="bg-secondary h-32 animate-pulse rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ))
          ) : users && users.length > 0 ? (
            users.map((user: User, idx: number) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: idx * 0.07,
                  ease: "easeInOut",
                }}
              >
                <Card className="bg-background flex flex-col rounded-xl shadow transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <img
                        src={user.image ?? "/default-image.png"}
                        alt={user.name ?? "User   "}
                        className="h-12 w-12 rounded-full border object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-semibold capitalize">
                          {user.name}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {user.email}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {user.gender ? user.gender : "-"} |{" "}
                          {user.relationshipStatus
                            ? user.relationshipStatus.replace(/_/g, " ")
                            : "-"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Age: {getAge(user.birthDate?.toString()) ?? "-"}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/profile/${user.id}`}
                      className="text-primary text-xs font-medium hover:underline"
                    >
                      View Profile
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground col-span-full py-8 text-center text-lg"
            >
              No users found.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
