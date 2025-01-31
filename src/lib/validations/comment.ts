import * as z from "zod"

export const commentSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

export const editCommentSchema = z.object({
  commentText: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

export const replyCommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

export type Comment = z.infer<typeof commentSchema>
export type EditComment = z.infer<typeof editCommentSchema>
export type Reply = z.infer<typeof replyCommentSchema>
