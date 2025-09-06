"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { likePost } from "@/server/like"
import type { User } from "@/lib/generated/prisma"
import type { IPage, IPost } from "@/types"

// Helper to optimistically update the like state in the cache
function updateLikeCache(
  oldData: InfiniteData<IPage<IPost<User>[]>> | undefined,
  postId: string
): InfiniteData<IPage<IPost<User>[]>> | undefined {
  if (!oldData) return oldData
  return {
    ...oldData,
    pages: oldData.pages.map((page) => {
      if (!page) return page
      return {
        ...page,
        data: page.data.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  likePost: post._count.likePost + 1,
                },
                isLiked: true,
              }
            : post
        ),
      }
    }),
  }
}

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
  const postsQueryKey = userId ? ["posts", userId] : ["posts"]

  const likePostMutation = useMutation({
    mutationFn: async () => {
      const res = await likePost({ postId, content })

      // we don't need to throw an error message here, just return the response
      // we added rate limiting on the server side
      // so if the user tries to like a post too quickly, it will return an error
      // but we don't want to block the UI, just return undefined
      if (!res?.ok) {
        return
      }

      return res
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey })
      const previousPost = queryClient.getQueryData(postsQueryKey)
      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        postsQueryKey,
        (oldData) => updateLikeCache(oldData, postId)
      )
      return { previousPost }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(postsQueryKey, context?.previousPost)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey })
    },
  })

  return { likePostMutation }
}
