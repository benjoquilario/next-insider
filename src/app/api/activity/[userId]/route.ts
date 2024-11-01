import db from "@/lib/db"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const userId = params.userId

  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")

  const activities = await db.activity.findMany({
    where: {
      sourceUserId: userId,
    },
    include: {
      sourceUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      targetUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit) || 5,
    skip: Number(skip) || 0,
  })

  const nextId =
    activities.length < Number(limit)
      ? undefined
      : activities[Number(limit) - 1].id

  if (activities.length === 0) {
    return NextResponse.json({
      activities: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  return NextResponse.json({
    activities,
    hasNextPage: activities.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      activities.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
