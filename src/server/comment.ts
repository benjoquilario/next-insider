"use server"

import db from "@/lib/db"
import { getUser } from "@/lib/user"
import { type CreateComment } from "@/types"

export async function createComment(comment: CreateComment) {
  const { commentText, postId } = comment

  const session = await getUser()

  if (!session) return

  const userId = session.id

  const createdComment = await db.comment.create({
    data: {
      comment: commentText,
      postId,
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
      commentLike: {
        select: {
          id: true,
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          commentLike: true,
        },
      },
    },
  })

  console.log(createdComment)

  return {
    data: createdComment,
    message: "Comment Created",
    ok: true,
  }
}

export async function updateComment({
  comment,
  commentId,
}: {
  comment: string
  commentId: string
}) {
  const session = await getUser()

  if (!session) return

  const updatedComment = await db.comment.update({
    where: {
      id: commentId,
    },
    data: {
      comment,
      isEdited: true,
      updatedAt: new Date(),
    },
  })

  return {
    ok: true,
    data: updatedComment,
    message: "Comment Updated",
  }
}

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  const session = await getUser()

  if (!session)
    return {
      ok: false,
      message: "Unathenticated",
    }

  const comment = await db.comment.findUnique({
    where: {
      id: commentId,
    },
  })

  if (comment) {
    await db.comment.delete({
      where: {
        id: comment.id,
      },
      include: {
        replyComment: {
          where: {
            commentId: comment.id,
          },
        },
        commentLike: {
          where: {
            commentId: comment.id,
          },
        },
      },
    })
  }
}
