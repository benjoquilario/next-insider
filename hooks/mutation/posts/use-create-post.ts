"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { createPost } from "@/server/post"
import type { User } from "@/generated/prisma"
import type { CreatePost, IPage, IPost } from "@/types"

// Helper to update the posts cache with the new post at the top of the first page
function updatePostsCache(
  oldData: InfiniteData<IPage<IPost<User>[]>> | undefined,
  newPost: any
): InfiniteData<IPage<IPost<User>[]>> | undefined {
  if (!oldData || !newPost?.data) return oldData
  return {
    ...oldData,
    pages: oldData.pages.map((page, idx) =>
      idx === 0 ? { ...page, data: [newPost.data, ...(page.data ?? [])] } : page
    ),
  }
}

export function useCreatePostMutation(userId?: string) {
  const queryClient = useQueryClient()
  // Use a dynamic query key based on userId if user create post in his profile
  // Otherwise, use a generic key for all posts
  // This allows us to update the cache correctly based on the context
  const postsQueryKey = userId ? ["posts", userId] : ["posts"]

  const writePostMutation = useMutation({
    mutationFn: async (post: CreatePost) => {
      const res = await createPost(post)

      if (!res.ok) {
        throw new Error(res.message)
      }

      return res
    },
    onSuccess: (newPost) => {
      if (!newPost?.data) return
      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        postsQueryKey,
        (oldData) => updatePostsCache(oldData, newPost)
      )
    },
    onSettled: () => {
      // Invalidate to refetch and sync with server
      queryClient.invalidateQueries({ queryKey: postsQueryKey })
    },
  })

  return { writePostMutation }
}
