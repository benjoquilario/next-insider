"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import usePostStore from "@/store/post"
import { useForm } from "react-hook-form"
import { type PostData } from "@/types"
import { FileUploader } from "@/components/file-uploader"
import { useUploadThing } from "@/lib/uploadthing"
// import { getErrorMessage } from "@/lib/handle-error"
import { useCreatePostMutation } from "@/hooks/mutation/posts/use-create-post"
import { useUpdateMutation } from "@/hooks/mutation/posts/use-update-post"
import { FileSelectedCard } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { ISelectedFile } from "@/types"
import { X } from "lucide-react"

interface CreatePostProps {
  content: string
  selectedFile: ISelectedFile[]
  userId?: string
}

const CreatePost = ({ content, selectedFile }: CreatePostProps) => {
  const [isError, setIsError] = useState(false)

  const {
    isPostOpen,
    setIsPostOpen,
    isUpdating,
    setIsUpdating,
    deletedKeys,
    deletedFiles,
    clearDeletedKeys,
    clearDeletedFiles,
    clearSelectedPost,
    setDeletedFiles,
    setDeletedKeys,
  } = usePostStore()

  const postId = usePostStore((state) => state.selectedPost.postId)

  const form = useForm<PostData>({
    defaultValues: {
      content: "",
      selectedFile: [],
    },
  })

  const [fileState, setFileState] =
    React.useState<ISelectedFile[]>(selectedFile)

  console.log(content)

  const { writePostMutation } = useCreatePostMutation()
  const { updatePostMutation } = useUpdateMutation()
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      console.log("Success")
    },
    onUploadError: (e) => {
      setIsError(true)
      toast.error(e.message)
    },
  })

  console.log(fileState)

  const handleOnRemove = React.useCallback(
    (id: string, key: string) => {
      if (!fileState) return
      const newFiles = fileState.filter((file) => file.id !== id)
      setFileState(newFiles)

      setDeletedFiles(id)
      setDeletedKeys(key)
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileState]
  )

  useEffect(() => {
    if (isUpdating) {
      form.setValue("content", content)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, postId, isUpdating])

  const reset = () => {
    form.reset()
    setIsUpdating(false)
    setIsPostOpen(false)
    clearSelectedPost()
    clearDeletedFiles()
    clearDeletedKeys()
  }

  const submit = function (formData: PostData) {
    if (isError) return

    toast.promise(
      startUpload(formData.selectedFile ?? []).then((data) => {
        if (isUpdating) {
          updatePostMutation.mutate({
            postId: postId,
            content: formData.content,
            selectedFile: data
              ? data?.map((file) => {
                  return {
                    url: file.url,
                    name: file.name,
                    type: file.type,
                    key: file.key,
                  }
                })
              : [],
            deletedKeys,
            fileIds: deletedFiles,
          })
        } else
          writePostMutation.mutate({
            content: formData.content,
            selectedFile: data
              ? data?.map((file) => {
                  return {
                    url: file.url,
                    name: file.name,
                    type: file.type,
                    key: file.key,
                  }
                })
              : [],
          })
      }),
      {
        loading: "Posting...",
        success: () => {
          reset()
          return "Post successfully created"
        },
        finally: () => {
          setIsError(false)
          reset()
        },
      }
    )
  }

  return (
    <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
      <DialogContent className="sm:max-w-[505px]">
        <div className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Creating Post</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new post or update an existing one
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              autoComplete="off"
              className=""
              onSubmit={form.handleSubmit(submit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <textarea
                        aria-label={`What's on your mind, Benjo?`}
                        className="bg-background text-foreground/90 w-full rounded-t-md px-0 py-3 text-sm focus:outline-none md:text-base"
                        placeholder={`What's on your mind, Benjo?`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedFile"
                render={({ field }) => (
                  <div className="space-y-6">
                    <FormItem className="w-full">
                      <FormLabel className="sr-only">Images</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxFileCount={4}
                          maxSize={4 * 1024 * 1024}
                          // pass the onUpload function here for direct upload
                          // onUpload={uploadFiles}
                          disabled={isUploading}
                        >
                          {fileState?.length
                            ? fileState?.map((file, index) => (
                                <FileSelectedCard
                                  key={`${file.url}-${index}`}
                                  name={file.id!}
                                  file={file.url}
                                  id={file.id!}
                                  fileKey={file.key}
                                  onRemove={handleOnRemove}
                                />
                              ))
                            : null}
                        </FileUploader>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <Button
                disabled={form.formState.isSubmitSuccessful}
                className="mt-2 w-full"
                type="submit"
              >
                Post
              </Button>
            </form>
          </Form>

          <DialogClose asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 size-8 rounded-sm px-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default CreatePost
