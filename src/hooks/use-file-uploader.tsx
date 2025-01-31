"use client"

import * as React from "react"
import { type DropzoneProps, type FileRejection } from "react-dropzone"
import { useControllableState } from "./use-controllable-state"
import { toast } from "sonner"

interface FileUploaderProps {
  value?: File[]
  onValueChange?: (files: File[]) => void
  onUpload?: (files: File[]) => Promise<void>
  progresses?: Record<string, number>
  accept?: DropzoneProps["accept"]
  maxSize?: DropzoneProps["maxSize"]
  maxFileCount?: DropzoneProps["maxFiles"]
  multiple?: boolean
  disabled?: boolean
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string"
}

export const useFileUploader = ({
  value: valueProp,
  onUpload,
  maxFileCount,
  multiple,
  disabled,
  onValueChange,
}: FileUploaderProps) => {
  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  })

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error("Cannot upload more than 1 file at a time")
        return
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount!) {
        toast.error(`Cannot upload more than ${maxFileCount} files`)
        return
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`)
        })
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFileCount!
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([])
            return `${target} uploaded`
          },
          error: `Failed to upload ${target}`,
        })
      }
    },

    [files, maxFileCount, multiple, onUpload, setFiles]
  )

  function onRemove(index: number) {
    if (!files) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onValueChange?.(newFiles)
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount!

  return {
    onDrop,
    onRemove,
    files,
    isDisabled
  }
}
