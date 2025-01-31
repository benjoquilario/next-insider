"use client"

import PhotoUploader from "./photo-uploader"
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { uploadFiles } from "@/lib/uploadthing"
import { updateProfilePicture } from "@/server/user"

const ProfilePhoto = ({
  image,
  isProfileOwner,
}: {
  image: string
  isProfileOwner: boolean
}) => {
  async function onUpload(files: File[]) {
    try {
      const res = await uploadFiles("coverPhoto", {
        files,
      })

      await updateProfilePicture({
        url: res[0].url,
      })
      console.log(res)
    } catch (err) {
      toast.error(`Error ${err}`)
    }
  }

  return (
    <div className="relative -mt-20 shrink-0">
      <Avatar className="size-[114px] border-2 border-input">
        <AvatarImage src={image ?? "/default-image.png"} alt={""} />
        <AvatarFallback>
          <div className="size-full animate-pulse"></div>
        </AvatarFallback>
      </Avatar>
      {isProfileOwner ? (
        <PhotoUploader
          onUpload={onUpload}
          maxFileCount={4}
          maxSize={4 * 1024 * 1024}
          className="absolute bottom-3 right-3 flex size-8 items-center justify-center gap-1 rounded-full px-1 text-foreground md:rounded-md"
        />
      ) : null}
    </div>
  )
}
export default ProfilePhoto
