"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { createPost } from "@/server/post"
import type { User } from "@prisma/client"
import type { CreatePost, IPage, IPost } from "@/types"

export function useCreatePostMutation(userId?: string) {
  const queryClient = useQueryClient()
  const queryKey = ["posts"]

  const writePostMutation = useMutation({
    mutationFn: (post: CreatePost) => createPost(post),
    onSuccess: (newPost) => {
      if (userId) {
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          ["posts", userId],
          (oldData) => {
            if (!oldData) return

            const newPosts = {
              ...oldData,
              pages: oldData.pages.map((page, index) => {
                if (index === 0) {
                  return {
                    ...page,
                    data: [
                      newPost?.data,
                      ...(page.data ? page.data : new Array()),
                    ],
                  }
                }

                return page
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
              pages: oldData.pages.map((page, index) => {
                if (index === 0) {
                  return {
                    ...page,
                    data: [
                      newPost?.data,
                      ...(page.data ? page.data : new Array()),
                    ],
                  }
                }

                return page
              }),
            }

            return newPosts
          }
        )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { writePostMutation }
}
