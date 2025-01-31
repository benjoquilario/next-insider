"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { deleteComment } from "@/server/comment"
import { IPage, Comment } from "@/types"
import { type User } from "@prisma/client"

const useDeleteComment = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient()
  const queryKey = ["comments", postId]

  const deleteCommentMutation = useMutation({
    mutationFn: ({ commentId }: { commentId: string }) =>
      deleteComment({ commentId }),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<IPage<Comment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newCommens = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const deletedComments = page.data.filter(
                (comment) => comment.id !== deletedPost.commentId
              )

              return {
                ...page,
                data: deletedComments,
              }
            }),
          }

          return newCommens
        }
      )

      return { previousComment }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  return { deleteCommentMutation }
}
export { useDeleteComment }
