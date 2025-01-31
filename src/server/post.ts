"use server"

import { getUser } from "@/lib/user"
import db from "@/lib/db"
import type { CreatePost, UpdatePost } from "@/types"
import { UTApi } from "uploadthing/server"

export const createPost = async (data: CreatePost) => {
  const session = await getUser()

  if (!session) return

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
    data: newPost,
    message: "success",
  }
}

export const updatePost = async (
  values: UpdatePost & { fileIds: string[]; deletedKeys: string[] }
) => {
  const session = await getUser()
  const utapi = new UTApi()

  if (!session) return

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
}

export const deletePost = async ({ postId }: { postId: string }) => {
  const session = await getUser()
  const utapi = new UTApi()

  if (!session)
    return {
      ok: false,
      message: "Unathenticated",
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

  if (selectedFiles) {
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
}
