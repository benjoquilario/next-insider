"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import TextareaAutoSize from "react-textarea-autosize"
import usePostStore from "@/store/post"
import { FaPhotoVideo } from "react-icons/fa"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { usePostUpload } from "@/hooks/usePostUpload"
import PostUpload from "./post-upload"
import { useUpdateDeleteMutation } from "@/hooks/useUpdateDeletePost"
import { useCreatePostMutation } from "@/hooks/useCreatePostMutation"
import { Cross2Icon } from "@radix-ui/react-icons"
import { toast } from "sonner"

type CreatePostFormProps = {
  userId?: string
}

const CreatePostForm = (props: CreatePostFormProps) => {
  const { userId } = props
  const {
    getRootProps,
    getInputProps,
    form,
    startUpload,
    isUploading,
    isError,
    setIsError,
  } = usePostUpload()

  const [isPostOpen, setIsPostOpen] = usePostStore((store) => [
    store.isPostOpen,
    store.setIsPostOpen,
  ])

  const [selectedPostId, setSelectedPostId] = usePostStore((store) => [
    store.selectedPostId,
    store.setSelectedPostId,
  ])
  const isEditing = usePostStore((store) => store.isEditing)
  const setIsEditing = usePostStore((store) => store.setIsEditing)
  const [clearDeletedKeys, clearDeletedFiles] = usePostStore((store) => [
    store.clearDeletedKeys,
    store.clearDeletedFiles,
  ])

  const handleOnReset = useCallback(() => {
    form.reset()
    setIsEditing(false)
    setSelectedPostId("")
    clearDeletedKeys()
    clearDeletedFiles()
    clearSelectedPost()
    setIsPostOpen(false)
    setIsError(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { updatePostMutation, deletePostMutation } = useUpdateDeleteMutation(
    userId,
    handleOnReset
  )
  const { createPostMutation } = useCreatePostMutation(handleOnReset, userId)
  const selectedPost = usePostStore((store) => store.selectedPost)
  const clearSelectedPost = usePostStore((store) => store.clearSelectedPost)

  const [deletedFiles, deletedKeys] = usePostStore((store) => [
    store.deletedFiles,
    store.deletedKeys,
  ])

  useEffect(() => {
    form.setFocus("content")
  }, [form])

  useEffect(() => {
    if (selectedPostId && selectedPost) {
      form.setValue("content", selectedPost.content)
    }
  }, [selectedPostId, form, selectedPost])

  const handleOnSubmit = async function (values: IPostValues) {
    if (isError) return

    toast.promise(
      startUpload(values.selectedFile ?? []).then((data) => {
        if (isEditing && selectedPostId) {
          updatePostMutation.mutate({
            content: values.content,
            selectedFile: data
              ? data?.map((image) => ({
                  url: image.url,
                  key: image.key,
                }))
              : null,
            postId: selectedPostId,
            fileIds: deletedFiles,
            deletedKeys,
          })
        } else {
          createPostMutation.mutate({
            content: values.content,
            selectedFile: data
              ? data?.map((image) => ({
                  url: image.url,
                  key: image.key,
                }))
              : null,
          })
        }
      }),
      {}
    )
  }

  return (
    <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Updating Post" : "Creating Post"}
          </DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        {/* <div>{src?.map((s) => <Image src={s} alt={s} />)}</div> */}
        <div
          className={cn(
            "relative border-t"

            // isImageDragged && "outline-dashed outline-blue-500"
          )}
          // {...getRootProps()}
        >
          <Form {...form}>
            <form
              autoComplete="off"
              className=""
              onSubmit={form.handleSubmit(handleOnSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <TextareaAutoSize
                        aria-label={`What's on your mind, Benjo?`}
                        className="w-full rounded-t-md bg-background px-0 py-3 text-sm text-foreground/90 focus:outline-none md:text-base"
                        placeholder={`What's on your mind, Benjo?`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <PostUpload
                  control={form.control}
                  setValue={form.setValue}
                  selectedFile={selectedPost.selectedFile}
                >
                  <div
                    {...getRootProps()}
                    className="flex cursor-pointer items-center border p-2"
                  >
                    <input {...getInputProps()} />
                    <div></div>
                    Upload Photo :
                    <FaPhotoVideo className="ml-3 h-8 w-9" />
                  </div>
                </PostUpload>
              </div>

              <div className="flex items-center justify-center">
                <Button
                  disabled={
                    isUploading ||
                    updatePostMutation.isPending ||
                    createPostMutation.isPending
                  }
                  type="submit"
                  className="my-2 flex w-full items-center justify-center rounded-md px-3 py-2 text-sm md:text-base"
                >
                  {isEditing ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOnReset()}
            className="absolute right-4 top-4 size-8 rounded-sm px-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <Cross2Icon className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostForm
