import db from "@/lib/db"
import { getUser } from "@/lib/user"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params

  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")
  const session = await getUser()

  const userId = session?.id

  const comments = await db.comment.findMany({
    where: {
      postId,
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
      commentLike: {
        select: {
          id: true,
        },
        where: {
          userId: session?.id,
        },
      },
      _count: {
        select: {
          commentLike: true,
          replyComment: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit) || 5,
    skip: Number(skip) || 0,
  })

  if (comments.length === 0) {
    return NextResponse.json({
      data: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  const transformedPosts = comments.map((post) => {
    const { _count, commentLike, user, ...rest } = post
    return {
      ...rest,
      user,
      _count,
      commentLike,
      haveReplies: _count.replyComment !== 0 ? true : false,
      isLiked: session ? commentLike.length > 0 : false,
      isUserComment: user.id === userId ? true : false,
    }
  })

  return NextResponse.json({
    data: transformedPosts,
    hasNextPage: comments.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      comments.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
