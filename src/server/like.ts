"use server"

import { getUser } from "@/lib/user"
import db from "@/lib/db"
import { headers } from "next/headers"
import { ratelimit } from "@/lib/redis"

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
      status: 409,
    }
  }

  await db.likeReplyComment.delete({
    where: {
      id: likeExist?.id,
    },
  })

  return
}
