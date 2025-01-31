import * as z from "zod"

export const createPostSchema = z.object({
  content: z.string().min(1),
  selectedFile: z.instanceof(File),
})
