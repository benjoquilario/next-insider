"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { replyCommentSchema, Reply } from "@/lib/validations/comment"
import { Textarea } from "@/components/ui/text-area"
import { useUpdateRepliesMutation } from "@/hooks/mutation/replies/use-update-replies"
import useRepliesStore from "@/store/replies"
import { toast } from "sonner"
import * as React from "react"

interface EditRepliesProps {
  id: string
  content: string
  commentId: string
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const EditReplies = ({
  content,
  commentId,
  isEditing,
  setIsEditing,
  id,
}: EditRepliesProps) => {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const clearSelectedReplies = useRepliesStore(
    (state) => state.clearSelectedReplies
  )
  const form = useForm<Reply>({
    resolver: zodResolver(replyCommentSchema),
    defaultValues: {
      content: content,
    },
  })

  const reset = React.useCallback(() => {
    form.reset()
    setIsEditing(false)

    clearSelectedReplies()
  }, [form, setIsEditing, clearSelectedReplies])

  React.useEffect(() => {
    form.setFocus("content")
  }, [form])

  const { updateReplyMutation } = useUpdateRepliesMutation({ commentId })

  const submit = function (formData: Reply) {
    updateReplyMutation.mutate(
      {
        content: formData.content,
        replyId: id,
      },
      {
        onSuccess: () => {
          reset()
          toast.success("reply updated successfully")
        },
      }
    )
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault()
      buttonRef?.current?.click()
      reset()
    }
  }

  return (
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
                              placeholder="Write a comment..."
                              onKeyDown={handleKeyPress}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isEditing && (
                    <div className="flex gap-1 text-xs text-muted-foreground/80">
                      <span>Press Esc to</span>
                      <button
                        onClick={reset}
                        type="button"
                        className="text-primary"
                      >
                        cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                ref={buttonRef}
                type="submit"
                className="absolute bottom-6 right-4 text-xl text-primary"
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditReplies
