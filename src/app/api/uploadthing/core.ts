import { getUser } from "@/lib/user"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 4,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const user = await getUser()
      if (!user) throw new UploadThingError("Unauthorized")
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      return { uploadedBy: metadata.userId }
    }),
  coverPhoto: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await getUser()

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // console.log("Upload complete for userId:", metadata.userId)

      console.log("file url", file.url)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.url }
    }),
  profilePicture: f(["image"])
    .middleware(async () => {
      const user = await getUser()

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter
export type OurFileRouter = typeof ourFileRouter
