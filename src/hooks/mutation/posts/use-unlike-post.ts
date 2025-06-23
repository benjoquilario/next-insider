import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { unlikePost } from "@/server/like"
import type { User } from "@/generated/prisma"
import type { IPage, IPost } from "@/types"

// Helper to optimistically update the unlike state in the cache
function updateUnlikeCache(
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
                  likePost: post._count.likePost - 1,
                },
                isLiked: false,
              }
            : post
        ),
      }
    }),
  }
}

export const useUnlikeMutation = ({
  postId,
  userId,
}: {
  postId: string
  userId?: string
}) => {
  const queryClient = useQueryClient()
  const postsQueryKey = userId ? ["posts", userId] : ["posts"]

  const unlikePostMutation = useMutation({
    mutationFn: () => unlikePost({ postId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey })
      const previousPost = queryClient.getQueryData(postsQueryKey)
      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        postsQueryKey,
        (oldData) => updateUnlikeCache(oldData, postId)
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

  return { unlikePostMutation }
}
