"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { createPost } from "@/server/post"
import { toast } from "sonner"
import {
  type PostData,
  type CreateNewPost,
  type Post,
} from "@/lib/validations/post"

const optimisticUpdate = (
  queryClient: QueryClient,
  queryKey: string[],
  newPost?: Post
) =>
  queryClient.setQueryData<InfiniteData<InfinitePage<PostData[]>>>(
    queryKey,
    (oldData) => {
      if (!oldData) return

      const newPosts = {
        ...oldData,
        pages: oldData.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              data: [newPost, ...(page.data ? page.data : new Array())],
            }
          }

          return page
        }),
      }

      return newPosts
    }
  )

export function useCreatePostMutation(userId?: string) {
  const queryClient = useQueryClient()

  const queryKey = QUERY_KEYS.GET_INFINITE_POSTS

  const createPostMutation = useMutation({
    mutationFn: (post: CreateNewPost) => createPost(post),
    onSuccess: (newPost) => {
      optimisticUpdate(queryClient, [queryKey], newPost.data)
      if (userId) {
        optimisticUpdate(queryClient, [queryKey, userId], newPost.data)
      }

      toast.success("Post created successfully")
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  })

  return { createPostMutation }
}
