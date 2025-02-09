"use client"

import { IoMdSend } from "react-icons/io"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useUser } from "@/lib/auth"
import { useCreateCommentMutation } from "@/hooks/mutation/comments/use-create-comment"
import { commentSchema } from "@/lib/validations/comment"
import * as React from "react"
import { Textarea } from "@/components/ui/text-area"
import { toast } from "sonner"

const CreateComment = React.memo(({ postId }: { postId: string }) => {
  const user = useUser()

  const form = useForm<z.infer<typeof commentSchema>>({
    defaultValues: {
      comment: "",
    },
  })

  React.useEffect(() => {
    form.setFocus("comment")
  }, [form])

  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  const { createCommentMutation } = useCreateCommentMutation({ postId })

  const submit = function (formData: z.infer<typeof commentSchema>) {
    createCommentMutation.mutate(
      {
        commentText: formData.comment,
        postId: postId,
      },
      {
        onError: (error) => {
          return toast.error(error.message)
        },
      }
    )

    form.reset()
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault()
      buttonRef?.current?.click()
      form.reset()
    }
  }

  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="-mt-2">
        <div className="relative">
          <Link
            href={`/profile/`}
            className="relative inline-block w-full shrink basis-auto items-stretch"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user?.session?.image ?? "/default-image.png"}
                alt={`@${user.session?.name}`}
              />
              <AvatarFallback>
                <div className="size-full animate-pulse bg-primary/10"></div>
              </AvatarFallback>
            </Avatar>
            <div className="pointer-events-none absolute inset-0 rounded-full"></div>
          </Link>
        </div>
      </div>
      <div className="grow overflow-hidden">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="relative flex w-full flex-wrap justify-end"
            >
              <div className="relative w-full">
                <div className="flex flex-wrap justify-end">
                  <div className="shrink grow basis-auto overflow-hidden pb-2">
                    <div className="relative p-1">
                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Comment</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Write a comment..."
                                onKeyDown={handleKeyPress}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <button
                  ref={buttonRef}
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="absolute bottom-6 right-4 text-xl text-primary"
                >
                  <IoMdSend />
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
})

CreateComment.displayName = "CreateComment"

export default CreateComment
