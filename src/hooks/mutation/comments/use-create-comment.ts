"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { createComment } from "@/server/comment"
import type { User } from "@prisma/client"
import { IPage, Comment, CreateComment } from "@/types"
import * as React from "react"

export function useCreateCommentMutation({ postId }: { postId: string }) {
  const queryKey = React.useMemo(() => ["comments", postId], [postId])
  const queryClient = useQueryClient()

  const createCommentMutation = useMutation({
    mutationFn: (comment: CreateComment) =>
      createComment({
        postId: comment.postId,
        commentText: comment.commentText,
      }),
    onSuccess: (newComment) => {
      queryClient.setQueryData<InfiniteData<IPage<Comment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComments = {
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

          return newComments
        }
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { createCommentMutation }
}
