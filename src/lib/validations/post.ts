import * as z from "zod"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { posts, postImages } from "@/db/schema/post"
import { users } from "@/db/schema"
import { type User } from "./user"

export const insertPostSchema = createInsertSchema(posts, {
  content: (schema) => schema.content.trim().min(3).max(255),
}).omit({ id: true, createdAt: true, authorId: true })

export const selectPostSchema = createSelectSchema(posts)

export const insertPostImageSchema = createInsertSchema(postImages, {
  postId: (schema) => schema.postId.uuid().nullable(),
  imageUrl: (schema) => schema.imageUrl.trim().max(255),
  fileName: (schema) => schema.fileName.trim().max(255),
  fileKey: (schema) => schema.fileKey.trim().max(255),
})

export const selectPostImageSchema = createSelectSchema(postImages)

export type Post = z.infer<typeof selectPostSchema>
export type NewPost = z.infer<typeof insertPostSchema>
export type PostImage = z.infer<typeof selectPostImageSchema>
export type NewPostImage = z.infer<typeof insertPostImageSchema>
export type CreateNewPost = NewPost & { images: NewPostImage[] }
export type PostData = Post & {
  images: PostImage[]
  author: User
}
