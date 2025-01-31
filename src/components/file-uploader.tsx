"use client"

//https://github.com/sadmann7/file-uploader/blob/main/src/components/file-uploader.tsx
import * as React from "react"
import Image from "next/image"
import { FileText, Upload, X } from "lucide-react"
import Dropzone, { type DropzoneProps } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFileUploader } from "@/hooks/use-file-uploader"

export interface FileUploaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[]

  /**
   * Function to be called when the value changes.
   * @type (files: File[]) => void
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: File[]) => void

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps["accept"]

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps["maxSize"]

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFileCount={4}
   */
  maxFileCount?: DropzoneProps["maxFiles"]

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean
  children?: React.ReactNode
}

export function FileUploader(props: FileUploaderProps) {
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
    children,
    ...dropzoneProps
  } = props

  const { files, isDisabled, onDrop, onRemove } = useFileUploader({
    value: valueProp,
    onUpload,
    maxFileCount,
    multiple,
    disabled,
    onValueChange,
  })

  return (
    <>
      <ScrollArea className="h-fit w-full px-2">
        <div className="flex max-h-56 flex-col gap-4">
          {files?.length
            ? files?.map((file, index) => (
                <FileCard
                  key={index}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={progresses?.[file.name]}
                />
              ))
            : null}
          {children}
        </div>
      </ScrollArea>

      <div className="relative flex flex-col gap-6 overflow-hidden">
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFileCount}
          multiple={maxFileCount > 1 || multiple}
          disabled={isDisabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                "group relative grid h-14 w-full cursor-pointer place-items-center rounded-lg border px-5 py-1.5 text-center transition hover:bg-muted/25",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isDragActive && "border-muted-foreground",
                isDisabled && "pointer-events-none opacity-60",
                className
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="flex w-full items-center justify-start gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-2">
                    <Upload
                      className="size-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Upload Photo
                  </p>
                </div>
              ) : (
                <div className="flex w-full items-center justify-start gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-2">
                    <Upload
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-px">
                    <p className="text-sm font-medium text-muted-foreground">
                      Upload Photo
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </>
  )
}

interface FileCardProps {
  file: File
  progress?: number
  onRemove: () => void
}

interface FileSelectedCardProps {
  file: string
  name: string
  fileKey: string
  id: string
  onRemove: (id: string, key: string) => void
}

export const FileSelectedCard = React.memo(
  ({ file, onRemove, name, id, fileKey }: FileSelectedCardProps) => {
    return (
      <div className="relative flex items-center gap-2.5">
        <div className="flex flex-1 gap-2.5">
          <div className="relative h-[360px] w-full">
            <FileSelectedPreview file={file} name={name} />
          </div>
        </div>
        <div className="absolute right-0 top-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => onRemove(id, fileKey)}
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      </div>
    )
  }
)

FileSelectedCard.displayName = "FileSelectedCard"

function FileCard({ file, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="flex flex-1 gap-2.5">
        <div className="relative h-[360px] w-full">
          {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
        </div>
      </div>
      <div className="absolute right-0 top-0">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  )
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string"
}

interface FilePreviewProps {
  file: File & { preview: string }
}

function FilePreview({ file }: FilePreviewProps) {
  if (file.type.startsWith("image/")) {
    return (
      <Image
        src={file.preview}
        alt={file.name}
        fill
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    )
  }

  return (
    <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
  )
}

function FileSelectedPreview({ file, name }: { file: string; name: string }) {
  return (
    <Image
      src={file}
      alt={name}
      fill
      loading="lazy"
      className="aspect-square shrink-0 rounded-md object-cover"
    />
  )
}
