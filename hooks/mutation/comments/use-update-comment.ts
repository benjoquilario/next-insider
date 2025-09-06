"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { updateComment } from "@/server/comment"
import type { IPage, Comment } from "@/types"
import type { User } from "@/generated/prisma"
import { toast } from "sonner"

const useUpdateComment = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient()
  const queryKey = ["comments", postId]

  const updateCommentMutation = useMutation({
    mutationFn: ({
      comment,
      commentId,
    }: {
      comment: string
      commentId: string
    }) => updateComment({ commentId, comment }),
    onMutate: async (updatedComment) => {
      queryClient.setQueryData<InfiniteData<IPage<Comment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const updatedComments = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const index = page.data?.findIndex(
                (oldPost) => oldPost.id === updatedComment.commentId
              )

              const newComments = [...page.data]

              newComments[index] = {
                ...page.data[index],
                updatedAt: new Date(),
                comment: updatedComment.comment,
                isEdited: true,
              }

              return {
                ...page,
                data: newComments,
              }
            }),
          }

          return updatedComments
        }
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => {
      toast.error("Failed to update comment")
    },
  })

  return { updateCommentMutation }
}

export { useUpdateComment }
