"use client"

import React from "react"
import PostItem from "./post-item"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import PostSkeleton from "@/components/skeleton/post-skeleton"
import { InView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { getPosts } from "@/db/queries/post"

const Posts = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const queryKey = [QUERY_KEYS.GET_INFINITE_POSTS]

  const {
    data: posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await getPosts(5, pageParam)

      data.data.map((post) => {
        queryClient.setQueryData(["posts", post.id], post)
      })

      return data
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    refetchOnWindowFocus: false,
  })

  return (
    <ul className="space-y-3">
      <AnimatePresence>
        {isPending
          ? Array.from(Array(2), (_, i) => <PostSkeleton key={i} />)
          : posts?.pages.map((page) =>
              page?.data.map((post) => (
                <motion.li
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}

                  // className="relative z-10 flex flex-col gap-1 overflow-hidden rounded-md border shadow"
                >
                  <PostItem
                    key={post.id}
                    isUserPost={post.author.id === session?.user.id}
                    post={post}
                  />
                </motion.li>
              ))
            )}
        <InView
          fallbackInView
          onChange={async (InView) => {
            if (InView && hasNextPage && !isFetchingNextPage) {
              await fetchNextPage()
            }
          }}
        >
          {({ ref }) => (
            <li ref={ref} className="mt-4 w-full">
              {isFetchingNextPage &&
                Array.from(Array(2), (_, i) => <PostSkeleton key={i} />)}
            </li>
          )}
        </InView>
      </AnimatePresence>
    </ul>
  )
}

export default Posts
