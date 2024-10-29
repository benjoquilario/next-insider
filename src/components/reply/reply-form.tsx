"use client"

import React, { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import TextareaAutoSize from "react-textarea-autosize"
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
import { useCreateReplyCommentMutation } from "@/hooks/useReplyMutation"
import { useQueryUser } from "@/hooks/queries/useQueryUser"
import Link from "next/link"

const replySchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

type ReplyCommentFormProps = {
  commentId: string
  replyId: string
  replyName: string
}

const ReplyCommentForm = (props: ReplyCommentFormProps) => {
  const { replyId, commentId, replyName } = props
  const { data: currentUser, isPending } = useQueryUser()

  const form = useForm<z.infer<typeof replySchema>>({
    defaultValues: {
      content: "",
    },
  })

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const { createReplyCommentMutation } = useCreateReplyCommentMutation({
    commentId,
  })

  useEffect(() => {
    form.setFocus("content")
  }, [form])

  async function handleOnSubmit(data: z.infer<typeof replySchema>) {
    // await createCommentMutation.mutateAsync({
    //   postId,
    //   commentText: data.comment,
    // })

    createReplyCommentMutation.mutate({
      commentId,
      content: data.content,
    })

    form.reset()
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset()
    }
  }, [form])

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
            href={`/profile/${currentUser?.id}`}
            className="relative inline-block w-full shrink basis-auto items-stretch"
            // aria-label={comment.user?.name}
          >
            <Avatar className="size-8">
              <AvatarImage
                src={currentUser?.image ?? "/default-image.png"}
                alt={`@${currentUser?.name}`}
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
              onSubmit={form.handleSubmit(handleOnSubmit)}
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
                              <TextareaAutoSize
                                {...field}
                                placeholder="Write a reply..."
                                className={cn(
                                  "relative w-full rounded-lg bg-secondary py-2 pl-3 pr-9 text-sm text-foreground/90 shadow ring-secondary/80 transition",
                                  "hover:ring-secondary-70 hover:text-foreground",
                                  "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-foreground/60 active:text-foreground/70",
                                  "focus:outline-none focus:outline-offset-1 focus:outline-primary focus-visible:outline-offset-2 focus-visible:outline-primary"
                                )}
                                defaultValue={`@${replyName.split(" ").join("").toLowerCase()} `}
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

export default ReplyCommentForm
