"use server"

import { getUser } from "@/lib/user"
import db from "@/lib/db"
import { ratelimit } from "@/lib/redis"
import { headers } from "next/headers"

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
