"use server"

import { getUser } from "@/lib/user"
import db from "@/lib/db"
import type { CreatePost, UpdatePost } from "@/types"
import { UTApi } from "uploadthing/server"
import { ratelimit } from "@/lib/redis"
import { headers } from "next/headers"
import { Prisma } from "@prisma/client"

export const createPost = async (data: CreatePost) => {
  try {
    const ip = (await headers()).get("x-forwarded-for")
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
    const { content, selectedFile } = data
    const transformedSelectedFile = selectedFile?.map((file) => ({
      url: file.url,
      key: file.key,
    }))

    const newPost = await db.post.create({
      data: {
        content: content,
        userId,
        selectedFile: {
          create: transformedSelectedFile,
        },
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
        likePost: true,
        _count: {
          select: {
            likePost: true,
            comment: true,
          },
        },
      },
    })

    return {
      ok: true,
      data: newPost,
      message: "success",
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return {
        ok: false,
        message: `Prisma error: ${error.message}`,
      }
    }
    console.error("Create post error:", error)
    return {
      ok: false,
      message: "An unexpected error occurred while creating the post.",
    }
  }
}

export const updatePost = async (
  values: UpdatePost & { fileIds: string[]; deletedKeys: string[] }
) => {
  try {
    const session = await getUser()
    const utapi = new UTApi()
    if (!session)
      return {
        ok: false,
        message: "Unauthenticated",
      }

    const { content, selectedFile, postId, fileIds, deletedKeys } = values

    if (fileIds.length && deletedKeys.length) {
      await db.selectedFile.deleteMany({
        where: {
          id: {
            in: fileIds,
          },
        },
      })
      await utapi.deleteFiles(deletedKeys)
    }

    const updatedPost = await db.post.update({
      where: {
        id: postId,
      },
      data: {
        content: content,
      },
      include: {
        selectedFile: true,
      },
    })

    if (selectedFile?.length) {
      await db.selectedFile.createMany({
        data: selectedFile.map((file) => ({
          url: file.url,
          postId: updatedPost.id,
          key: file.key,
        })),
      })
    }

    return {
      ok: true,
      data: updatedPost,
      message: "Post Updated",
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        message: `Prisma error: ${error.message}`,
      }
    }
    console.error("Update post error:", error)
    return {
      ok: false,
      message: "An unexpected error occurred while updating the post.",
    }
  }
}

export const deletePost = async ({ postId }: { postId: string }) => {
  try {
    const session = await getUser()
    const utapi = new UTApi()
    if (!session)
      return {
        ok: false,
        message: "Unauthenticated",
      }

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    })

    const selectedFiles = await db.selectedFile.findMany({
      where: {
        postId: post?.id,
      },
    })

    if (selectedFiles && selectedFiles.length) {
      const selectedFileKey = selectedFiles.map((files) => files.key)
      await utapi.deleteFiles(selectedFileKey)
    }

    if (post) {
      await db.post.delete({
        where: {
          id: post.id,
        },
        include: {
          selectedFile: {
            where: {
              postId: post.id,
            },
          },
          comment: {
            where: {
              postId,
            },
          },
          likePost: {
            where: {
              postId,
            },
          },
        },
      })
    }
    return {
      ok: true,
      message: "Post deleted successfully",
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        message: `Prisma error: ${error.message}`,
      }
    }
    console.error("Delete post error:", error)
    return {
      ok: false,
      message: "An unexpected error occurred while deleting the post.",
    }
  }
}
