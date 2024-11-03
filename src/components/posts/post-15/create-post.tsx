"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import TextareaAutoSize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { insertPostSchema, Post, NewPostImage } from "@/lib/validations/post"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createPost } from "@/server/post"
import { FileUploader } from "@/components/file-uploader"
import { useUploadFile } from "@/hooks/use-upload-file"
import { Cross2Icon } from "@radix-ui/react-icons"
import TextArea from "@/components/text-area"
import { type User } from "@/lib/validations/user"
import { type PostImage, type NewPost } from "@/lib/validations/post"
import usePostStore from "@/store/post"

const formSchema = insertPostSchema.extend({
  images: z
    .custom<File[] | undefined | null>()
    .optional()
    .nullable()
    .default(null),
})

type FormValues = z.infer<typeof formSchema>

const CreatePost = () => {
  const { startUpload, isUploading } = useUploadFile("mediaPost")
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      images: [],
    },
  })
  const reset = usePostStore((state) => state.reset)
  const isPostOpen = usePostStore((state) => state.isPostOpen)
  const setIsPostOpen = usePostStore((state) => state.setIsPostOpen)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleResetFn = () => {
    reset()
  }

  const submit = (values: FormValues) => {
    toast.promise(
      startUpload(values.images ?? []).then((data) => {
        const newPost = {
          content: values.content,
          images: data
            ? data.map((file) => ({
                fileKey: file.key,
                imageUrl: file.url,
                fileName: file.name,
              }))
            : [],
        }

        return createPost(newPost as NewPost & { images: NewPostImage[] })
      }),
      {
        loading: "Creating post...",
        success: () => {
          form.reset()
          handleResetFn()
          return "Post created successfully"
        },
        error: (err) => {
          return "Failed to create post"
        },
      }
    )
  }

  console.log(form.formState.errors)

  return (
    <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Creating Post</DialogTitle>
        </DialogHeader>
        <div
          className={cn("relative border-t")}
          // {...getRootProps()}
        >
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(submit)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">Content</FormLabel>
                    <FormControl>
                      <TextArea
                        aria-label={`What's on your mind, Benjo?`}
                        placeholder={`What's on your mind, Benjo?`}
                        onChange={field.onChange}
                        value={field.value ?? ""}
                        maxRows={6}
                        ref={textareaRef}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <div className="space-y-6">
                    <FormItem className="w-full">
                      <FormLabel className="sr-only">Images</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value ?? []}
                          onValueChange={field.onChange}
                          maxFiles={4}
                          maxSize={4 * 1024 * 1024}
                          disabled={isUploading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  className="my-2 flex w-full items-center justify-center rounded-md px-3 py-2 text-sm md:text-base"
                >
                  Create Post
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="sm"
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
export default CreatePost
