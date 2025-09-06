"use server"

import { getUser } from "@/lib/user"
import db from "@/lib/db"
import { headers } from "next/headers"
import { ratelimit } from "@/lib/redis"
import { PostsCacheManager } from "@/lib/posts-cache-manager"

async function createNotification({
  type,
  userId,
  fromUserId,
  postId,
  commentId,
  replyId,
  message,
}: {
  type: "POST_LIKE" | "COMMENT_LIKE" | "REPLY_LIKE"
  userId: string
  fromUserId: string
  postId?: string
  commentId?: string
  replyId?: string
  message?: string
}) {
  if (userId === fromUserId) return // Don't notify self
  await db.notification.create({
    data: {
      userId,
      fromUserId,
      type,
      postId,
      commentId,
      replyId,
      message,
    },
  })
}

export const likePost = async ({
  postId,
  content,
}: {
  postId: string
  content: string
}) => {
  const ip = (await headers()).get("x-forwarded-for")
  const session = await getUser()

  if (!session) return

  const userId = session.id

  const { success } = await ratelimit.limit(`${ip}`)

  if (!success) {
    return {
      ok: false,
      message:
        "Yo! Calm down cowboy, you are commenting too fast! take a few breath and calm down",
    }
  }

  const isLiked = await db.likePost.count({
    where: {
      userId,
      postId,
    },
  })

  if (isLiked) {
    return {
      ok: false,
      status: 409,
    }
  }

  const postLike = await db.likePost.create({
    data: {
      userId: userId,
      postId,
    },
    select: {
      userId: true,
      post: {
        select: {
          userId: true,
        },
      },
    },
  })

  if (postLike) {
    await db.activity.create({
      data: {
        type: "POST_LIKE",
        sourceUserId: userId!,
        targetId: postLike.post.userId,
        contentId: postId,
        content,
      },
    })
    // Notification
    await createNotification({
      type: "POST_LIKE",
      userId: postLike.post.userId,
      fromUserId: userId!,
      postId,
      message: `${session.name ?? "Someone"} liked your post`,
    })

    // Invalidate cache after like action
    await PostsCacheManager.invalidateOnPostInteraction(
      postId,
      postLike.post.userId
    )
  }

  return
}

export const unlikePost = async ({ postId }: { postId: string }) => {
  const ip = (await headers()).get("x-forwarded-for")
  const session = await getUser()

  if (!session) return
  const userId = session.id

  const { success } = await ratelimit.limit(`${ip}`)

  if (!success) {
    return {
      ok: false,
      message:
        "Yo! Calm down cowboy, you are commenting too fast! take a few breath and calm down",
    }
  }

  const isLiked = await db.likePost.count({
    where: {
      userId,
      postId,
    },
  })

  const likeExist = await db.likePost.findFirst({
    where: {
      userId,
      postId,
    },
  })

  if (!isLiked && !likeExist) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.likePost.delete({
    where: {
      id: likeExist?.id,
    },
  })

  // Get the post to find the author for cache invalidation
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { userId: true },
  })

  if (post) {
    // Invalidate cache after unlike action
    await PostsCacheManager.invalidateOnPostInteraction(postId, post.userId)
  }

  return
}

export const likeComment = async ({
  commentId,
  content,
}: {
  commentId: string
  content: string
}) => {
  const session = await getUser()

  if (!session) return

  const ip = (await headers()).get("x-forwarded-for")

  const { success } = await ratelimit.limit(`${ip}`)

  if (!success) {
    return {
      ok: false,
      message:
        "Yo! Calm down cowboy, you are commenting too fast! take a few breath and calm down",
    }
  }

  const userId = session.id

  const isLiked = await db.commentLike.count({
    where: {
      userId,
      commentId,
    },
  })

  if (isLiked) {
    return {
      ok: false,
      status: 409,
    }
  }

  const like = await db.commentLike.create({
    data: {
      userId: userId,
      commentId,
    },
    select: {
      userId: true,
      comment: {
        select: {
          userId: true,
        },
      },
    },
  })

  if (like) {
    await db.activity.create({
      data: {
        type: "COMMENT_LIKE",
        sourceUserId: userId!,
        targetId: like.comment.userId,
        contentId: commentId,
        content,
      },
    })
    // Notification
    await createNotification({
      type: "COMMENT_LIKE",
      userId: like.comment.userId,
      fromUserId: userId!,
      commentId,
      message: `${session.name ?? "Someone"} liked your comment`,
    })
  }

  return
}

export const unlikeComment = async ({ commentId }: { commentId: string }) => {
  const session = await getUser()
  const ip = (await headers()).get("x-forwarded-for")

  const { success } = await ratelimit.limit(`${ip}`)

  if (!success) {
    return {
      ok: false,
      message:
        "Yo! Calm down cowboy, you are commenting too fast! take a few breath and calm down",
    }
  }

  if (!session) return
  const userId = session.id

  const isLiked = await db.commentLike.count({
    where: {
      userId,
      commentId,
    },
  })

  const likeExist = await db.commentLike.findFirst({
    where: {
      userId,
      commentId,
    },
  })

  if (!isLiked && !likeExist) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.commentLike.delete({
    where: {
      id: likeExist?.id,
    },
  })

  return
}

export const likeReplyComment = async ({
  replyId,
  content,
}: {
  replyId: string
  content: string
}) => {
  const session = await getUser()

  if (!session) return
  const userId = session.id

  const ip = (await headers()).get("x-forwarded-for")

  const { success } = await ratelimit.limit(`${ip}`)

  if (!success) {
    return {
      ok: false,
      message:
        "Yo! Calm down cowboy, you are commenting too fast! take a few breath and calm down",
    }
  }

  const isLiked = await db.likeReplyComment.count({
    where: {
      userId,
      replyId,
    },
  })

  if (isLiked) {
    return {
      ok: false,
      message: "Already liked this reply",
    }
  }

  const likeReply = await db.likeReplyComment.create({
    data: {
      userId: userId!,
      replyId,
    },
    select: {
      userId: true,
      reply: {
        select: {
          userId: true,
        },
      },
    },
  })

  if (likeReply) {
    await db.activity.create({
      data: {
        type: "REPLY_LIKE",
        sourceUserId: userId!,
        targetId: likeReply.reply.userId,
        content,
        contentId: replyId,
      },
    })
    // Notification
    await createNotification({
      type: "REPLY_LIKE",
      userId: likeReply.reply.userId,
      fromUserId: userId!,
      replyId,
      message: `${session.name ?? "Someone"} liked your reply`,
    })
  }

  return
}

export const unlikeReplyComment = async ({ replyId }: { replyId: string }) => {
  const session = await getUser()

  if (!session) return

  const userId = session.id

  const ip = (await headers()).get("x-forwarded-for")

  const { success } = await ratelimit.limit(`${ip}`)

  if (!success) {
    return {
      ok: false,
      message:
        "Yo! Calm down cowboy, you are commenting too fast! take a few breath and calm down",
    }
  }

  const isLiked = await db.likeReplyComment.count({
    where: {
      userId,
      replyId,
    },
  })

  const likeExist = await db.likeReplyComment.findFirst({
    where: {
      userId,
      replyId,
    },
  })

  if (!isLiked && !likeExist) {
    return {
      ok: false,
      message: "You haven't liked this reply yet",
    }
  }

  await db.likeReplyComment.delete({
    where: {
      id: likeExist?.id,
    },
  })

  return
}
