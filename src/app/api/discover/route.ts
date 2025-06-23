import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import type { Gender, RelationshipStatus } from "@/generated/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const gender = searchParams.get("gender") as Gender | null
  const relationshipStatus = searchParams.get(
    "relationshipStatus"
  ) as RelationshipStatus | null
  const minAge = searchParams.get("minAge")
  const maxAge = searchParams.get("maxAge")
  const name = searchParams.get("name")

  // Build Prisma where filter
  const where: any = {}
  if (gender) where.gender = gender
  if (relationshipStatus) where.relationshipStatus = relationshipStatus
  if (name) {
    where.OR = [
      { name: { contains: name, mode: "insensitive" } },
      { username: { contains: name, mode: "insensitive" } },
    ]
  }
  // Age filter: convert min/max age to birthDate range
  if (minAge || maxAge) {
    const now = new Date()
    let birthDateFilter: any = {}
    if (minAge) {
      // Users at least minAge years old: birthDate <= now - minAge
      const maxBirth = new Date(now)
      maxBirth.setFullYear(now.getFullYear() - Number(minAge))
      birthDateFilter.lte = maxBirth
    }
    if (maxAge) {
      // Users at most maxAge years old: birthDate >= now - maxAge
      const minBirth = new Date(now)
      minBirth.setFullYear(now.getFullYear() - Number(maxAge) - 1)
      birthDateFilter.gte = minBirth
    }
    where.birthDate = birthDateFilter
  }

  // Query users (limit for demo, add pagination as needed)
  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      gender: true,
      relationshipStatus: true,
      birthDate: true,
      website: true,
      address: true,
      phoneNumber: true,
      createdAt: true,
    },
  })

  return NextResponse.json(users)
}
