"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { deletePost } from "@/server/post"
import type { User } from "@/generated/prisma"
import { IPage, IPost } from "@/types"

// Helper to optimistically remove a post from the cache
function removePostFromCache(
  oldData: InfiniteData<IPage<IPost<User>[]>> | undefined,
  postId: string
): InfiniteData<IPage<IPost<User>[]>> | undefined {
  if (!oldData) return oldData
  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.filter((post) => post.id !== postId),
    })),
  }
}

export const useDeletePost = (userId?: string) => {
  const queryClient = useQueryClient()
  const postsQueryKey = userId ? ["posts", userId] : ["posts"]

  const deletePostMutation = useMutation({
    mutationFn: ({ postId }: { postId: string }) => deletePost({ postId }),
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey })
      const previousPosts = queryClient.getQueryData(postsQueryKey)
      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        postsQueryKey,
        (oldData) => removePostFromCache(oldData, deletedPost.postId)
      )
      return { previousPosts }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(postsQueryKey, context?.previousPosts)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey })
    },
  })

  return { deletePostMutation }
}
