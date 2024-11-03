"use client"

import { type OurFileRouter } from "@/app/api/uploadthing/core"
import { getErrorMessage } from "@/lib/handle-error"
import { useUploadThing } from "@/lib/uploadthing"
import * as React from "react"
import { toast } from "sonner"
import type { UploadFilesOptions } from "uploadthing/types"

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: StoredFile[]
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<StoredFile[]>(defaultUploadedFiles)
  const [progresses, setProgresses] = React.useState(0)

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const formattedRes: StoredFile[] = res.map((file) => {
        return {
          id: file.key,
          name: file.name,
          url: file.url,
        }
      })

      setUploadedFiles((prev) =>
        prev ? [...prev, ...formattedRes] : formattedRes
      )
    },
    onUploadError: (err) => {
      // setProgresses(progress)
      toast.error(getErrorMessage(err))
    },
    onUploadProgress: (progress) => {
      // setProgresses(progress)
      console.log("progress", progress)
    },
  })

  return {
    uploadedFiles,
    progresses,
    startUpload,
    isUploading,
  }
}
