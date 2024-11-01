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
import { Label } from "@/components/ui/label"
import { insertPostSchema, NewPost, NewPostImage } from "@/lib/validations/post"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useUploadThing } from "@/lib/uploadthing"
import { createPost } from "@/server/post"
import { FileUploader } from "@/components/file-uploader"

const formSchema = insertPostSchema.extend({
  images: z
    .custom<File[] | undefined | null>()
    .optional()
    .nullable()
    .default(null),
})

type FormValues = z.infer<typeof formSchema>

const CreatePost = () => {
  const { startUpload, isUploading } = useUploadThing("mediaPost")
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      images: [],
    },
  })

  const submit = async (values: FormValues) => {
    toast.promise(
      startUpload(values.images ?? []).then((data) => {
        const newPost = {
          content: values.content,
          authorId: null,
          images: data
            ? data?.map((value) => {
                return {
                  fileKey: value.key,
                  fileName: value.name,
                  imageUrl: value.url,
                }
              })
            : null,
        }

        return createPost(newPost as NewPost & { images: NewPostImage[] })
      }),
      {
        loading: "Creating post...",
        success: () => {
          form.reset()
          return "Post created successfully"
        },
        error: (err) => {
          return "Failed to create post"
        },
      }
    )
  }

  return (
    <>
      <Dialog>
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
                <Label htmlFor="content" className="sr-only">
                  What's on your mind, Benjo?
                </Label>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <TextareaAutoSize
                      aria-label={`What's on your mind, Benjo?`}
                      className="w-full rounded-t-md bg-background px-0 py-3 text-sm text-foreground/90 focus:outline-none md:text-base"
                      placeholder={`What's on your mind, Benjo?`}
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <div className="space-y-6">
                      <FormItem className="w-full">
                        <FormLabel>Images</FormLabel>
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
              {/* <Cross2Icon className="size-4" /> */}
              <span className="">Close</span>
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default CreatePost
