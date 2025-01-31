"use client"

import React from "react"
import PostItem from "./post-item"
import { useInfiniteQuery } from "@tanstack/react-query"
// import { QUERY_KEYS } from "@/lib/queriesKey"
// import PostSkeleton from "@/components/skeleton/post-skeleton"
import { InView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"
import PostSkeleton from "../skeleton/post-skeleton"
import { type IPost } from "@/types"
import { type User } from "@prisma/client"

const Posts = () => {
  const {
    data: posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/posts?cursor=${pageParam}&limit=${3}`)

      const data = await res.json()

      return data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  return (
    <ul className="w-full space-y-3">
      <AnimatePresence>
        {isPending
          ? Array.from(Array(2), (_, i) => (
              <PostSkeleton key={`post-${i}-skeleton`} />
            ))
          : posts?.pages.map((page) =>
              page?.data.map((post: IPost<User>) => (
                <motion.li
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex flex-col gap-1 overflow-hidden rounded-md border shadow"
                >
                  <PostItem
                    key={post.id}
                    // will be removed once the query is fixed
                    post={post}
                    havePhoto={post.selectedFile.length !== 0}
                    isUserPost={post.isUserPost}
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
                Array.from(Array(2), (_, i) => <PostSkeleton key={i + 2} />)}
            </li>
          )}
        </InView>
      </AnimatePresence>
    </ul>
  )
}

export default Posts
