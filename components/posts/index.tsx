"use client"

import React from "react"
import PostItem from "./post-item.new"
import { useInfiniteQuery } from "@tanstack/react-query"
// import { QUERY_KEYS } from "@/lib/queriesKey"
// import PostSkeleton from "@/components/skeleton/post-skeleton"
import { InView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"
import PostSkeleton from "../skeleton/post-skeleton"
import { type IPost } from "@/types"
import { type User } from "@/lib/generated/prisma"

const postVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

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

  // Flatten posts for easier mapping
  const allPosts = React.useMemo(
    () => posts?.pages.flatMap((page) => page?.data || []) || [],
    [posts]
  )

  return (
    <motion.ul
      className="w-full space-y-3"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{}}
    >
      <AnimatePresence>
        {isPending ? (
          Array.from({ length: 2 }, (_, i) => (
            <li key={`post-${i}-skeleton`}>
              <PostSkeleton />
            </li>
          ))
        ) : (
          <>
            {allPosts.map((post: IPost<User>, idx) => (
              <motion.li
                key={post.id}
                variants={postVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  duration: 0.35,
                  delay: idx * 0.07,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex flex-col"
              >
                <PostItem
                  post={post}
                  havePhoto={post.selectedFile.length !== 0}
                  isUserPost={post.isUserPost}
                />
              </motion.li>
            ))}
          </>
        )}
      </AnimatePresence>
      {/* Infinite scroll loader */}
      <InView
        fallbackInView
        onChange={async (inView) => {
          if (inView && hasNextPage && !isFetchingNextPage) {
            await fetchNextPage()
          }
        }}
      >
        {({ ref }) => (
          <li ref={ref} className="mt-4 w-full">
            <AnimatePresence>
              {isFetchingNextPage &&
                Array.from({ length: 2 }, (_, i) => (
                  <motion.div
                    key={`fetching-skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PostSkeleton />
                  </motion.div>
                ))}
            </AnimatePresence>
          </li>
        )}
      </InView>
    </motion.ul>
  )
}

export default Posts
