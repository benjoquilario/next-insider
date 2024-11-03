"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { updatePost, deletePost } from "@/server/post"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@prisma/client"

const optimisticUpdate = (updatedPost, queryClient, queryKey) => {
  queryClient.setQueryData <
    InfiniteData<IPage<IPost<User>[]>>(queryKey, (oldData) => {
      if (!oldData) return

      const updatedPosts = {
        ...oldData,
        pages: oldData.pages.map((page) => {
          const index = page.posts?.findIndex(
            (oldPost) => oldPost.id === updatedPost.postId
          )

          const newPosts = [...page.posts]

          newPosts[index] = {
            ...page.posts[index],
            updatedAt: new Date(),
            id: updatedPost.postId,
            content: updatedPost.content,
          }

          return {
            ...page,
            posts: newPosts,
          }
        }),
      }

      return updatedPosts
    })
}

export function useUpdateDeleteMutation(
  userId?: string,
  handleOnCallback?: () => void
) {
  const queryClient = useQueryClient()
  const queryKey = [QUERY_KEYS.GET_INFINITE_POSTS]
  const { toast } = useToast()

  const updatePostMutation = useMutation({
    mutationFn: (
      values: IUpdatePost & { fileIds: string[]; deletedKeys: string[] }
    ) => updatePost(values),
    onMutate: async (updatedPost) => {
      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const updatedPosts = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const index = page.posts?.findIndex(
                (oldPost) => oldPost.id === updatedPost.postId
              )

              const newPosts = [...page.posts]

              newPosts[index] = {
                ...page.posts[index],
                updatedAt: new Date(),
                id: updatedPost.postId,
                content: updatedPost.content,
              }

              return {
                ...page,
                posts: newPosts,
              }
            }),
          }

          return updatedPosts
        }
      )

      if (userId) {
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          [QUERY_KEYS.GET_INFINITE_POSTS, userId],
          (oldData) => {
            if (!oldData) return

            const updatedPosts = {
              ...oldData,
              pages: oldData.pages.map((page) => {
                const index = page.posts?.findIndex(
                  (oldPost) => oldPost.id === updatedPost.postId
                )

                const newPosts = [...page.posts]

                newPosts[index] = {
                  ...page.posts[index],
                  updatedAt: new Date(),
                  id: updatedPost.postId,
                  content: updatedPost.content,
                }

                return {
                  ...page,
                  posts: newPosts,
                }
              }),
            }

            return updatedPosts
          }
        )
      }
    },
    onSuccess: () => {
      toast({
        title: "Post successfully updated",
      })

      handleOnCallback?.()
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deletePostMutation = useMutation({
    mutationFn: ({ postId }: { postId: string }) => deletePost({ postId }),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newPosts = {
            ...oldData,
            pages: oldData.pages.map((page, i) => {
              const deletedPosts = page.posts.filter(
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

      if (userId) {
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          [QUERY_KEYS.GET_INFINITE_POSTS, userId],
          (oldData) => {
            if (!oldData) return

            const newPosts = {
              ...oldData,
              pages: oldData.pages.map((page, i) => {
                const deletedPosts = page.posts.filter(
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
      }

      return { previousComment }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { updatePostMutation, deletePostMutation }
}
