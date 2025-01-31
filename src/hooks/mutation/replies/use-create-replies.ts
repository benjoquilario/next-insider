"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { createReplyComment } from "@/server/replies"
import type { User } from "@prisma/client"
import { useMemo } from "react"
import { IPage, ReplyComment } from "@/types"

export function useCreateReplyCommentMutation({
  commentId,
}: {
  commentId: string
}) {
  const queryKey = useMemo(() => ["replies", commentId], [commentId])
  const queryClient = useQueryClient()

  const createReplyCommentMutation = useMutation({
    mutationFn: (comment: { content: string; commentId: string }) =>
      createReplyComment({
        commentId: comment.commentId,
        content: comment.content,
      }),
    onSuccess: (newComment) => {
      queryClient.setQueryData<InfiniteData<IPage<ReplyComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newReplyComments = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  data: [
                    newComment?.data,
                    ...(page.data ? page.data : new Array()),
                  ],
                }
              }

              return page
            }),
          }

          return newReplyComments
        }
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { createReplyCommentMutation }
}
