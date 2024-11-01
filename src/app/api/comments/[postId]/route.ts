import db from "@/lib/db"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, props: { params: Promise<{ postId: string }> }) {
  const params = await props.params;
  const postId = params.postId

  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")
  const session = await auth()

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
          userId: session?.user.id,
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

  const nextId =
    comments.length < Number(limit) ? undefined : comments[Number(limit) - 1].id

  if (comments.length === 0) {
    return NextResponse.json({
      comments: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  const transformedPosts = comments.map((post) => {
    const { _count, commentLike, ...rest } = post
    return {
      ...rest,
      _count,
      commentLike,
      isLiked: session ? commentLike.length > 0 : false,
    }
  })

  return NextResponse.json({
    comments: transformedPosts,
    hasNextPage: comments.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      comments.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
