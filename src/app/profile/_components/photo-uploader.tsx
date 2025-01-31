"use client"

import { useFileUploader } from "@/hooks/use-file-uploader"
import { type FileUploaderProps } from "@/components/file-uploader"
import Dropzone from "react-dropzone"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhotoUploaderProps extends FileUploaderProps {
  isCover?: boolean
}

const PhotoUploader = (props: PhotoUploaderProps) => {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = {
      "image/*": [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    isCover = false,
    ...dropzoneProps
  } = props

  const { isDisabled, onDrop } = useFileUploader({
    value: valueProp,
    onUpload,
    maxFileCount,
    multiple,
    disabled,
    onValueChange,
  })

  console.log(progresses)

  return (
    <div className="bottom-3 right-3 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={cn(
              isDisabled && "pointer-events-none opacity-60",
              "cursor-pointer",
              "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
              "items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            <Camera className="size-4" />
            {isCover ? (
              <span className="hidden text-xs md:block">Edit cover photo</span>
            ) : null}
          </div>
        )}
      </Dropzone>
    </div>
  )
}
export default PhotoUploader
