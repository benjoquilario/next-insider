"use client"

import PhotoUploader from "./photo-uploader"
import Image from "next/image"
import { toast } from "sonner"
import { uploadFiles } from "@/lib/uploadthing"
import { updateCoverPicture } from "@/server/user"

const CoverPhoto = ({
  cover,
  isProfileOwner,
}: {
  cover: string
  isProfileOwner: boolean
}) => {
  async function onUpload(files: File[]) {
    try {
      const res = await uploadFiles("coverPhoto", {
        files,
      })

      await updateCoverPicture({
        url: res[0].url,
      })
      console.log(res)
    } catch (err) {
      toast.error(`Error ${err}`)
    }
  }

  console.log(cover)

  return (
    <div className="relative h-56 w-full overflow-hidden">
      <div className="relative size-full">
        <div className="relative h-56 w-full">
          <Image
            src={cover ?? "/cover.svg"}
            alt="profile"
            layout="fill"
            className="object-cover"
          />
        </div>
        {isProfileOwner ? (
          <PhotoUploader
            onUpload={onUpload}
            maxFileCount={4}
            maxSize={4 * 1024 * 1024}
            isCover
            className="text-foreground absolute right-3 bottom-3 flex size-8 items-center justify-center gap-1 rounded-full px-1 md:w-32 md:rounded-md"
          />
        ) : null}
      </div>
    </div>
  )
}
export default CoverPhoto
