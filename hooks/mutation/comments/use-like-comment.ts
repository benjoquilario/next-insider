"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { likeComment, unlikeComment } from "@/server/like"
import type { User } from "@/generated/prisma"
import { useMemo } from "react"
import type { Comment, IPage } from "@/types"

export function useLikeCommentMutation({
  postId,
  commentId,
  content,
}: {
  postId: string
  commentId: string
  content: string
}) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["comments", postId], [postId])

  const likeCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await likeComment({ commentId, content })

      if (!res?.ok) {
        return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<IPage<Comment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComments = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  data: page.data.map((comment) => {
                    if (comment.id === commentId) {
                      return {
                        ...comment,
                        _count: {
                          ...comment._count,
                          commentLike: comment._count.commentLike + 1,
                        },
                        isLiked: true,
                      }
                    } else {
                      return comment
                    }
                  }),
                }
              }

              return page
            }),
          }

          return newComments
        }
      )

      return { previousComment }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  const unlikeCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await unlikeComment({ commentId })

      if (!response?.ok) {
        return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<IPage<Comment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComments = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  data: page.data.map((comment) => {
                    if (comment.id === commentId) {
                      return {
                        ...comment,
                        _count: {
                          ...comment._count,
                          commentLike: comment._count.commentLike - 1,
                        },
                        isLiked: false,
                      }
                    } else {
                      return comment
                    }
                  }),
                }
              }

              return page
            }),
          }

          return newComments
        }
      )

      return { previousComment }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  return { likeCommentMutation, unlikeCommentMutation }
}
