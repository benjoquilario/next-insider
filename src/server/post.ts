"use server"

import { auth } from "@/auth"
// import db from "@/lib/db"
import { UTApi } from "uploadthing/server"
import { db } from "@/db"
import { postImages, posts } from "@/db/schema/post"
import { desc } from "drizzle-orm"
import { insertPostSchema, type CreateNewPost } from "@/lib/validations/post"
import { revalidatePath } from "next/cache"

// export const createPost = async (values: ICreatePost) => {
//   const session = await auth()

//   if (!session) return

//   const userId = session.user.id
//   // const name = session.user.name

//   const { content, selectedFile } = values

//   const newPost = await db.post.create({
//     data: {
//       content: content,
//       userId,
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           image: true,
//           email: true,
//         },
//       },
//       selectedFile: true,
//       likePost: true,
//       _count: {
//         select: {
//           likePost: true,
//           comment: true,
//         },
//       },
//     },
//   })

//   if (selectedFile?.length) {
//     await db.selectedFile.createMany({
//       data: selectedFile.map((file) => ({
//         url: file.url,
//         key: file.key,
//         postId: newPost.id,
//       })),
//     })
//   }

//   return {
//     data: newPost,
//     message: "success",
//   }
// }

// export const updatePost = async (
//   values: IUpdatePost & { fileIds: string[]; deletedKeys: string[] }
// ) => {
//   const session = await auth()
//   const utapi = new UTApi()

//   if (!session) return
//   const { content, selectedFile, postId, fileIds, deletedKeys } = values

//   if (fileIds.length && deletedKeys.length) {
//     await db.selectedFile.deleteMany({
//       where: {
//         id: {
//           in: fileIds,
//         },
//       },
//     })

//     await utapi.deleteFiles(deletedKeys)
//   }

//   const updatedPost = await db.post.update({
//     where: {
//       id: postId,
//     },
//     data: {
//       content: content,
//     },
//     include: {
//       selectedFile: true,
//     },
//   })

//   if (selectedFile?.length) {
//     await db.selectedFile.createMany({
//       data: selectedFile.map((file) => ({
//         url: file.url,
//         postId: updatedPost.id,
//         key: file.key,
//       })),
//     })
//   }

//   return {
//     ok: true,
//     data: updatedPost,
//     message: "Post Updated",
//   }
// }

// export const deletePost = async ({ postId }: { postId: string }) => {
//   const session = await auth()
//   const utapi = new UTApi()

//   if (!session)
//     return {
//       ok: false,
//       message: "Unathenticated",
//     }

//   const post = await db.post.findUnique({
//     where: {
//       id: postId,
//     },
//   })

//   const selectedFiles = await db.selectedFile.findMany({
//     where: {
//       postId: post?.id,
//     },
//   })

//   if (selectedFiles) {
//     const selectedFileKey = selectedFiles.map((files) => files.key)

//     await utapi.deleteFiles(selectedFileKey)
//   }

//   if (post) {
//     await db.post.delete({
//       where: {
//         id: post.id,
//       },
//       include: {
//         selectedFile: {
//           where: {
//             postId: post.id,
//           },
//         },
//         comment: {
//           where: {
//             postId,
//           },
//         },
//         likePost: {
//           where: {
//             postId,
//           },
//         },
//       },
//     })
//   }
// }

export const getPosts = async (limit = 5, skip = 0) => {
  const getPosts = await db.query.posts.findMany({
    with: {
      images: true,
      author: true,
    },
    limit: Number(limit) || 5,
    offset: Number(skip) || 0,
    orderBy: desc(posts.createdAt),
  })

  if (getPosts.length === 0) {
    return {
      data: [],
      hasNextPage: false,
      nextOffset: null,
    }
  }

  return {
    data: getPosts,
    hasNextPage: getPosts.length < (Number(limit) || 5) ? false : true,
    nextOffset:
      getPosts.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  }
}

export const createPost = async (data: CreateNewPost) => {
  const validatedFields = insertPostSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      message: "Invalid data",
    }
  }

  try {
    const { content } = validatedFields.data
    const session = await auth()

    if (!session) throw new Error("Unauthorized")

    const userId = session.user.id

    const [newPost] = await db
      .insert(posts)
      .values({
        content: content,
        authorId: userId,
      })
      .returning()

    if (data.images.length > 0 && newPost) {
      const newPostImage = data.images.map((image) => ({
        postId: newPost.id,
        imageUrl: image.imageUrl,
        fileName: image.fileName,
        fileKey: image.fileKey,
      }))

      await db.insert(postImages).values(newPostImage)
    }

    revalidatePath("/")

    return {
      data: newPost,
      message: "success",
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "An error occurred",
    }
  }
}

export async function deleteUploadedFiles(fileKeys: string[]) {
  try {
    const utapi = new UTApi()

    await utapi.deleteFiles(fileKeys)
    return { success: true, message: "Files deleted successfully" }
  } catch (error) {
    console.error("Error deleting files:", error)
    return { success: false, message: "Failed to delete files" }
  }
}
