"use server"

import { getUser } from "@/lib/user"
import db from "@/lib/db"
import { ratelimit } from "@/lib/redis"
import { headers } from "next/headers"

// Helper to create a notification if not self-action
async function createNotification({
  type,
  userId,
  fromUserId,
  postId,
  commentId,
  replyId,
  message,
}: {
  type: "REPLY"
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

export async function createReplyComment(comment: {
  content: string
  commentId: string
}) {
  const ip = (await headers()).get("x-forwarded-for")

  const { content, commentId } = comment

  const session = await getUser()
  const { success } = await ratelimit.limit(`${ip}`)

  if (!success) {
    throw new Error(
      "Yo! Calm down cowboy, you are commenting too fast! take a few breaths and calm down"
    )
  }
  if (!session) return

  const userId = session.id

  const createdReply = await db.replyComment.create({
    data: {
      content,
      commentId,
      userId: userId,
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
          userId: userId,
        },
      },
      _count: {
        select: {
          likeReplyComment: true,
        },
      },
    },
  })

  // Fetch the original comment to get the owner
  const parentComment = await db.comment.findUnique({
    where: { id: commentId },
    select: { userId: true, postId: true },
  })
  if (parentComment) {
    await createNotification({
      type: "REPLY",
      userId: parentComment.userId,
      fromUserId: userId,
      postId: parentComment.postId,
      commentId,
      replyId: createdReply.id,
      message: `${createdReply.user.name ?? "Someone"} replied to your comment`,
    })
  }

  return {
    data: createdReply,
    message: "Comment Created",
    ok: true,
  }
}

export async function updateReplyComment({
  content,
  replyId,
}: {
  content: string
  replyId: string
}) {
  const session = await getUser()

  if (!session) return

  const updatedReplyComment = await db.replyComment.update({
    where: {
      id: replyId,
    },
    data: {
      content,
      isEdited: true,
    },
  })

  return {
    ok: true,
    data: updatedReplyComment,
    message: "Comment Updated",
  }
}

export const deleteReplyComment = async ({ replyId }: { replyId: string }) => {
  const session = await getUser()

  if (!session)
    return {
      ok: false,
      message: "Unathenticated",
    }

  const replyComment = await db.replyComment.findUnique({
    where: {
      id: replyId,
    },
  })

  if (replyComment) {
    await db.replyComment.delete({
      where: {
        id: replyComment.id,
      },
    })
  }

  return
}
