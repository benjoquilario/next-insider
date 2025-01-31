import db from "./db"
import { getUser } from "./user"

export async function getPosts(limit = 5, skip: number) {
  const session = await getUser()

  const userId = session?.id

  const posts = await db.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          followers: {
            where: {
              followerId: userId!,
            },
          },
        },
      },
      likePost: {
        select: {
          id: true,
        },
        where: {
          userId: userId!,
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
    return {
      data: [],
      hasNextPage: false,
      nextSkip: null,
    }
  }

  const transformedPosts = posts.map((post) => {
    const { _count, likePost, user, ...rest } = post
    return {
      ...rest,
      _count,
      likePost,
      user,
      isFollowing: user.followers.length === 1,
      isLiked: session ? likePost.length > 0 : false,
      isUserPost: user.id === userId ? true : false,
    }
  })

  return {
    data: transformedPosts,
    hasNextPage: posts.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      posts.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  }
}

export async function getUsers() {
  const session = await getUser()

  const email = session?.email

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
    where: {
      NOT: {
        email: email,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 15,
    skip: 0,
  })

  return users
}

export async function getProfile({ userId }: { userId: string }) {
  const session = await getUser()

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        where: {
          followerId: session?.id,
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) return

  const followerCount = user._count.followers
  const followingCount = user._count.following

  const isProfileOwner = session?.id === userId

  return {
    ...user,
    followerCount,
    followingCount,
    isProfileOwner: isProfileOwner ? true : false,
    isFollowing: user.followers.length === 1 ? true : false,
  }
}
