"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { IPage, ReplyComment } from "@/types"
import { type User } from "@/lib/generated/prisma"
import { deleteReplyComment } from "@/server/replies"
import * as React from "react"

export const useDeleteReplies = ({ commentId }: { commentId: string }) => {
  const queryClient = useQueryClient()
  const queryKey = React.useMemo(() => ["replies", commentId], [commentId])

  const deleteReplyMutation = useMutation({
    mutationFn: ({ replyId }: { replyId: string }) =>
      deleteReplyComment({ replyId }),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<IPage<ReplyComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newReplies = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const deletedComments = page.data.filter(
                (reply) => reply.id !== deletedPost.replyId
              )

              return {
                ...page,
                data: deletedComments,
              }
            }),
          }

          return newReplies
        }
      )

      return { previousComment }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  return { deleteReplyMutation }
}
