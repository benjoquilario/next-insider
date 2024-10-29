"use client"

import React from "react"
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form"
import ImageThumbnail from "@/components/image-thumbnail"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { RiCloseFill } from "react-icons/ri"
import usePostStore from "@/store/post"

type PostUploadProps = {
  control: Control<IPostValues>
  setValue: UseFormSetValue<IPostValues>
  children: React.ReactNode
  disabled?: boolean
  selectedFile?: ISelectedFile[]
}

const PostUpload: React.FC<PostUploadProps> = (props) => {
  const { control, setValue, children, disabled, selectedFile } = props

  const [currentImages, setCurrentImages] = React.useState<
    ISelectedFile[] | undefined
  >(selectedFile)

  const [setDeletedFiles, setDeletedKeys] = usePostStore((store) => [
    store.setDeletedFiles,
    store.setDeletedKeys,
  ])

  const selectedImage = useWatch({
    control,
    name: "selectedFile",
    defaultValue: [],
  })

  const removeImage = (imageName: string) => {
    setValue(
      "selectedFile",
      selectedImage.filter((image) => image.name !== imageName)
    )
  }

  const handleRemove = React.useCallback((id: string, key: string) => {
    setDeletedFiles(id)
    setDeletedKeys(key)
    const removeItem = currentImages?.filter((image) => image.id !== id)

    setCurrentImages(removeItem)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="max-h-52 overflow-auto">
        {currentImages?.length
          ? currentImages?.map((image, index) => (
              <div className="relative" key={index}>
                <Button
                  onClick={() => handleRemove(image.id!, image.key)}
                  type="button"
                  className="absolute right-0 top-2 z-50 rounded-full bg-gray-600 p-1 text-white transition duration-75 ease-in hover:bg-gray-700"
                >
                  <RiCloseFill aria-hidden="true" size={22} />
                </Button>
                <div className={cn("relative h-40 w-full")}>
                  <Image
                    src={image.url}
                    style={{ objectFit: "cover" }}
                    fill
                    className="rounded-lg"
                    alt=""
                  />
                </div>
              </div>
            ))
          : null}

        {selectedImage.length
          ? selectedImage?.map((image) => {
              return (
                <ImageThumbnail
                  key={image.name}
                  image={image}
                  removeImage={removeImage}
                />
              )
            })
          : null}
      </div>
      {children}
    </>
  )
}

export default PostUpload
