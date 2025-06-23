"use server"

import db from "@/lib/db"
import { getUser } from "@/lib/user"
import { type CreateComment } from "@/types"
import { headers } from "next/headers"
import { ratelimit } from "@/lib/redis"
import { Prisma } from "@/generated/prisma"

export async function createComment(comment: CreateComment) {
  try {
    const ip = (await headers()).get("x-forwarded-for")
    const { commentText, postId } = comment
    const session = await getUser()
    const { success } = await ratelimit.limit(`${ip}`)

    if (!success) {
      return {
        ok: false,
        message:
          "Yo! Calm down cowboy, you are commenting too fast! take a few breath and calm down",
      }
    }

    if (!session)
      return {
        ok: false,
        message: "Unauthenticated",
      }

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

    return {
      data: createdComment,
      message: "Comment Created",
      ok: true,
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        message: `Prisma error: ${error.message}`,
      }
    }
    console.error("Create comment error:", error)
    return {
      ok: false,
      message: "An unexpected error occurred while creating the comment.",
    }
  }
}

export async function updateComment({
  comment,
  commentId,
}: {
  comment: string
  commentId: string
}) {
  try {
    const session = await getUser()
    if (!session)
      return {
        ok: false,
        message: "Unauthenticated",
      }

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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        message: `Prisma error: ${error.message}`,
      }
    }
    console.error("Update comment error:", error)
    return {
      ok: false,
      message: "An unexpected error occurred while updating the comment.",
    }
  }
}

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  try {
    const session = await getUser()
    if (!session)
      return {
        ok: false,
        message: "Unauthenticated",
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
    return {
      ok: true,
      message: "Comment deleted successfully",
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        message: `Prisma error: ${error.message}`,
      }
    }
    console.error("Delete comment error:", error)
    return {
      ok: false,
      message: "An unexpected error occurred while deleting the comment.",
    }
  }
}
