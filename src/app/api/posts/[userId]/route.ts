import db from "@/lib/db"
import { getUser } from "@/lib/user"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")
  const session = await getUser()

  const posts = await db.post.findMany({
    where: {
      userId,
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
      likePost: {
        select: {
          id: true,
        },
        where: {
          userId: session?.id,
        },
      },
      _count: {
        select: {
          likePost: true,
          comment: true,
        },
      },
      selectedFile: true,
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit) || 5,
    skip: Number(skip) || 0,
  })

  if (posts.length === 0) {
    return NextResponse.json({
      data: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  const transformedPosts = posts.map((post) => {
    const { _count, likePost, user, ...rest } = post
    return {
      ...rest,
      _count,
      likePost,
      user,
      isLiked: session ? likePost.length > 0 : false,
      isUserPost: user.id === userId ? true : false,
    }
  })

  return NextResponse.json({
    data: transformedPosts,
    hasNextPage: posts.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      posts.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
