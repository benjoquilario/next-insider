"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { IoMdSend } from "react-icons/io"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { replyCommentSchema } from "@/lib/validations/comment"
import { Reply } from "@/lib/validations/comment"
import { useCreateReplyCommentMutation } from "@/hooks/mutation/replies/use-create-replies"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/text-area"
import * as React from "react"

const CreateReplies = ({ commentId }: { commentId: string }) => {
  const form = useForm<Reply>({
    defaultValues: {
      content: "",
    },
  })

  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  const { createReplyCommentMutation } = useCreateReplyCommentMutation({
    commentId,
  })

  const submit = function (formData: z.infer<typeof replyCommentSchema>) {
    createReplyCommentMutation.mutate(
      {
        content: formData.content,
        commentId,
      },
      {
        onSuccess: () => {
          form.reset()
          toast.success("Reply created successfully")
        },
      }
    )
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
      <div className="-mt-1">
        <div className="relative mt-2">
          <div className="absolute bottom-[12px] left-[-34px] top-0 h-[21px] w-[57px] rounded-l border-b-2 border-l-2 border-l-input border-t-input md:left-[-42px]"></div>

          <Link
            href={`/profile/`}
            className="relative inline-block w-full shrink basis-auto items-stretch"
            // aria-label={comment.user?.name}
          >
            <Avatar className="size-8">
              <AvatarImage
                src={"/default-image.png"}
                alt={`@`}
                className="size-8"
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
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Comment</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Write a reply..."
                                // defaultValue={`@${replyName.split(" ").join("").toLowerCase()} `}
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
}
export default CreateReplies
