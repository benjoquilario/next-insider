import db from "@/lib/db"
import { getUser } from "@/lib/user"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params

  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")
  const session = await getUser()

  const userId = session?.id

  const replies = await db.replyComment.findMany({
    where: {
      commentId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      likeReplyComment: {
        select: {
          id: true,
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          likeReplyComment: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit) || 5,
    skip: Number(skip) || 0,
  })

  if (replies.length === 0) {
    return NextResponse.json({
      data: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  const transformedReplies = replies.map((post) => {
    const { _count, likeReplyComment, user, ...rest } = post
    return {
      ...rest,
      _count,
      user,
      likeReplyComment,
      isLiked: session ? likeReplyComment.length > 0 : false,
      isUserReplies: user.id === session?.id ? true : false,
    }
  })

  return NextResponse.json({
    data: transformedReplies,
    hasNextPage: replies.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      replies.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
