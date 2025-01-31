"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  EditComment as Edit,
  editCommentSchema,
} from "@/lib/validations/comment"
import { cn } from "@/lib/utils"
import useCommentStore from "@/store/comment"
import { useUpdateComment } from "@/hooks/mutation/comments/use-update-comment"
import TextareaAutoSize from "react-textarea-autosize"
import { toast } from "sonner"
import * as React from "react"

interface EditCommentProps {
  comment: string
  postId: string
  commentId: string
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const EditComment = ({
  comment,
  postId,
  commentId,
  isEditing,
  setIsEditing,
}: EditCommentProps) => {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const clearSelectedComment = useCommentStore(
    (state) => state.clearSelectedComment
  )
  const form = useForm<Edit>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: {
      commentText: comment,
    },
  })

  React.useEffect(() => {
    form.setFocus("commentText")
  }, [form])

  const reset = React.useCallback(() => {
    form.reset()
    setIsEditing(false)

    clearSelectedComment()
  }, [form, setIsEditing, clearSelectedComment])

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        reset()
      }
    }
    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [reset])

  const { updateCommentMutation } = useUpdateComment({ postId })

  const submit = function (formData: Edit) {
    updateCommentMutation.mutate(
      {
        comment: formData.commentText,
        commentId: commentId,
      },
      {
        onSuccess: () => {
          reset()
          toast.success("Comment updated successfully")
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
                      name="commentText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">
                            Edit Comment
                          </FormLabel>
                          <FormControl>
                            <TextareaAutoSize
                              {...field}
                              placeholder="Write a comment..."
                              className={cn(
                                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              )}
                              onKeyDown={handleKeyPress}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isEditing && (
                    <div className="flex gap-1 text-xs text-primary">
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

export default EditComment
