"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { deletePost } from "@/server/post"
import type { User } from "@prisma/client"
import { IPage, IPost } from "@/types"

export const useDeletePost = (userId?: string) => {
  const queryClient = useQueryClient()
  const queryKey = ["posts"]

  const deletePostMutation = useMutation({
    mutationFn: ({ postId }: { postId: string }) => deletePost({ postId }),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      if (userId) {
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          ["posts", userId],
          (oldData) => {
            if (!oldData) return

            const newPosts = {
              ...oldData,
              pages: oldData.pages.map((page) => {
                const deletedPosts = page.data.filter(
                  (post) => post.id !== deletedPost.postId
                )

                return {
                  ...page,
                  posts: deletedPosts,
                }
              }),
            }

            return newPosts
          }
        )
      } else
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          queryKey,
          (oldData) => {
            if (!oldData) return

            const newPosts = {
              ...oldData,
              pages: oldData.pages.map((page) => {
                const deletedPosts = page.data.filter(
                  (post) => post.id !== deletedPost.postId
                )

                return {
                  ...page,
                  data: deletedPosts,
                }
              }),
            }

            return newPosts
          }
        )

      return { previousComment }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  return { deletePostMutation }
}
