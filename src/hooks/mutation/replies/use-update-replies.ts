"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { IPage, ReplyComment } from "@/types"
import { type User } from "@prisma/client"
import { updateReplyComment } from "@/server/replies"
import * as React from "react"

export const useUpdateRepliesMutation = ({
  commentId,
}: {
  commentId: string
}) => {
  const queryClient = useQueryClient()
  const queryKey = React.useMemo(() => ["replies", commentId], [commentId])

  const updateReplyMutation = useMutation({
    mutationFn: ({ content, replyId }: { content: string; replyId: string }) =>
      updateReplyComment({ replyId, content }),
    onMutate: async (updatedComment) => {
      queryClient.setQueryData<InfiniteData<IPage<ReplyComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const updatedReplies = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const index = page.data?.findIndex(
                (oldPost) => oldPost.id === updatedComment.replyId
              )

              const newReplies = [...page.data]

              newReplies[index] = {
                ...page.data[index],
                content: updatedComment.content,
                isEdited: true,
              }

              return {
                ...page,
                data: newReplies,
              }
            }),
          }

          return updatedReplies
        }
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { updateReplyMutation }
}
