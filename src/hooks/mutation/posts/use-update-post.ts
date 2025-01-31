"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { updatePost } from "@/server/post"
import type { User } from "@prisma/client"
import type { UpdatePost, IPage, IPost } from "@/types"

export function useUpdateMutation(userId?: string) {
  const queryClient = useQueryClient()
  const queryKey = ["posts"]

  const updatePostMutation = useMutation({
    mutationFn: (
      values: UpdatePost & { fileIds: string[]; deletedKeys: string[] }
    ) => updatePost(values),
    onMutate: async (updatedPost) => {
      if (userId) {
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          ["posts", userId],
          (oldData) => {
            if (!oldData) return

            const updatedPosts = {
              ...oldData,
              pages: oldData.pages.map((page) => {
                const index = page.data?.findIndex(
                  (oldPost) => oldPost.id === updatedPost.postId
                )

                const newPosts = [...page.data]

                newPosts[index] = {
                  ...page.data[index],
                  updatedAt: new Date(),
                  id: updatedPost.postId,
                  content: updatedPost.content,
                }

                return {
                  ...page,
                  data: newPosts,
                }
              }),
            }

            return updatedPosts
          }
        )
      } else
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          queryKey,
          (oldData) => {
            if (!oldData) return

            const updatedPosts = {
              ...oldData,
              pages: oldData.pages.map((page) => {
                const index = page.data?.findIndex(
                  (oldPost) => oldPost.id === updatedPost.postId
                )

                const newPosts = [...page.data]

                newPosts[index] = {
                  ...page.data[index],
                  updatedAt: new Date(),
                  id: updatedPost.postId,
                  content: updatedPost.content,
                }

                return {
                  ...page,
                  data: newPosts,
                }
              }),
            }

            return updatedPosts
          }
        )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { updatePostMutation }
}
