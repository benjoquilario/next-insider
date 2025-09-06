import db from "@/lib/db"
import { PostsCacheManager } from "@/lib/posts-cache-manager"
import { getUser } from "@/lib/user"
import { type NextRequest, NextResponse } from "next/server"
import { type IPost } from "@/types"
import { type User } from "@/lib/generated/prisma"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const limit = Number(searchParams.get("limit")) || 5
  const skip = Number(searchParams.get("cursor")) || 0
  const session = await getUser()

  const userId = session?.id || "anonymous"

  // More specific cache key with proper typing
  const redisKey = PostsCacheManager.getFeedCacheKey(
    session?.id || null,
    skip,
    limit
  )

  try {
    const cachedPosts =
      await PostsCacheManager.getCachedPosts<IPost<User>>(redisKey)
    if (cachedPosts && Array.isArray(cachedPosts)) {
      return NextResponse.json({
        data: cachedPosts,
        hasNextPage: cachedPosts.length === limit,
        nextSkip: cachedPosts.length === limit ? skip + limit : null,
      })
    }
  } catch (error) {
    console.error("Redis cache error:", error)
    // Continue without cache if Redis fails
  }

  const posts = await db.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          followers: session?.id
            ? {
                where: {
                  followerId: session.id,
                },
              }
            : false,
        },
      },
      likePost: session?.id
        ? {
            select: {
              id: true,
            },
            where: {
              userId: session.id,
            },
          }
        : false,
      _count: {
        select: {
          likePost: true,
          comment: true,
        },
      },
      selectedFile: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: skip,
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
      isFollowing: user.followers ? user.followers.length === 1 : false,
      isLiked: session && likePost ? likePost.length > 0 : false,
      isUserPost: session ? user.id === session.id : false,
    }
  })

  // Cache the transformed posts with error handling
  try {
    await PostsCacheManager.cachePosts(redisKey, transformedPosts, 300) // Cache for 5 minutes
  } catch (error) {
    console.error("Failed to cache posts:", error)
    // Continue without caching if Redis fails
  }

  return NextResponse.json({
    data: transformedPosts,
    hasNextPage: posts.length === limit,
    nextSkip: posts.length === limit ? skip + limit : null,
  })
}

export async function POST(req: NextRequest) {
  try {
    const session = await getUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { content, selectedFiles } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Create new post
    const newPost = await db.post.create({
      data: {
        content: content.trim(),
        userId: session.id,
        selectedFile: selectedFiles
          ? {
              create: selectedFiles.map((file: any) => ({
                url: file.url,
                key: file.key,
              })),
            }
          : undefined,
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
        selectedFile: true,
        _count: {
          select: {
            likePost: true,
            comment: true,
          },
        },
      },
    })

    // Invalidate relevant caches
    await PostsCacheManager.invalidateOnNewPost(session.id)

    return NextResponse.json(
      {
        data: {
          ...newPost,
          isLiked: false,
          isFollowing: false,
          isUserPost: true,
          likePost: [],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
