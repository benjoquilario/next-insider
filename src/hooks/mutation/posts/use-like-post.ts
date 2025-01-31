"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { likePost } from "@/server/like"
import type { User } from "@prisma/client"
import type { IPage, IPost } from "@/types"

export function useLikePostMutation({
  postId,
  userId,
  content,
}: {
  postId: string
  userId?: string
  content: string
}) {
  const queryClient = useQueryClient()
  const queryKey = ["posts"]

  const likePostMutation = useMutation({
    mutationFn: () => likePost({ postId, content }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousPost = queryClient.getQueryData(queryKey)

      if (userId) {
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          ["posts", userId],
          (oldData) => {
            if (!oldData) return

            const newPosts = {
              ...oldData,
              pages: oldData.pages.map((page) => {
                if (page) {
                  return {
                    ...page,
                    data: page.data.map((post) => {
                      if (post.id === postId) {
                        return {
                          ...post,
                          _count: {
                            ...post._count,
                            likePost: post._count.likePost + 1,
                          },
                          isLiked: true,
                        }
                      } else {
                        return post
                      }
                    }),
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
              pages: oldData.pages.map((page) => {
                if (page) {
                  return {
                    ...page,
                    data: page.data.map((post) => {
                      if (post.id === postId) {
                        return {
                          ...post,
                          _count: {
                            ...post._count,
                            likePost: post._count.likePost + 1,
                          },
                          isLiked: true,
                        }
                      } else {
                        return post
                      }
                    }),
                  }
                }

                return page
              }),
            }

            return newPosts
          }
        )
      return { previousPost }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousPost)
    },
  })

  return { likePostMutation }
}
