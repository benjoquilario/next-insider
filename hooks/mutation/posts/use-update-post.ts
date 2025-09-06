"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { updatePost } from "@/server/post"
import type { User } from "@/lib/generated/prisma"
import type { UpdatePost, IPage, IPost } from "@/types"

// Helper to update the post in the cache
function updateCachedPost(
  oldData: InfiniteData<IPage<IPost<User>[]>> | undefined,
  updatedPost: UpdatePost & { postId: string; content: string }
): InfiniteData<IPage<IPost<User>[]>> | undefined {
  if (!oldData) return oldData
  return {
    ...oldData,
    pages: oldData.pages.map((page) => {
      const index = page.data?.findIndex(
        (oldPost) => oldPost.id === updatedPost.postId
      )
      if (index === undefined || index === -1) return page
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
}

export function useUpdateMutation(userId?: string) {
  const queryClient = useQueryClient()
  const postsQueryKey = userId ? ["posts", userId] : ["posts"]

  const updatePostMutation = useMutation({
    mutationFn: (
      values: UpdatePost & { fileIds: string[]; deletedKeys: string[] }
    ) => updatePost(values),
    onMutate: async (updatedPost) => {
      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        postsQueryKey,
        (oldData) => updateCachedPost(oldData, updatedPost)
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: postsQueryKey }),
  })

  return { updatePostMutation }
}
