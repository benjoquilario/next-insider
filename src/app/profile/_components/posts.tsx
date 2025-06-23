"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { InView } from "react-intersection-observer"
import { AnimatePresence, motion } from "framer-motion"
import CreateButton from "@/components/posts/create-button"
import type { User } from "@/generated/prisma"
import PostSkeleton from "@/components/skeleton/post-skeleton"
import PostItem from "@/components/posts/post-item"
import { useUser } from "@/lib/auth"
import { IPost } from "@/types"
import React from "react"

type PostsUserProps = {
  userId: string
  isUserPost: boolean
}

const Posts = (props: PostsUserProps) => {
  const { userId, isUserPost = false } = props
  const { session: user } = useUser()

  const {
    data: posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", userId],
    queryFn: ({ pageParam }) =>
      fetch(`/api/posts/${userId}?limit=${3}&cursor=${pageParam}`).then((res) =>
        res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  console.log(posts)

  return (
    <>
      {userId === user?.id && <CreateButton userId={userId} />}
      <ul className="space-y-3">
        <AnimatePresence>
          {isPending
            ? Array.from(Array(2), (_, i) => (
                <PostSkeleton key={`post-${userId}-${i}`} />
              ))
            : posts?.pages.map((page) =>
                page?.data.length !== 0 ? (
                  page?.data.map((post: IPost<User>) => (
                    <motion.li
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative z-10 flex flex-col gap-1 overflow-hidden rounded-md shadow"
                    >
                      <PostItem
                        isUserPost={isUserPost}
                        key={post.id}
                        post={post as any}
                        userId={userId}
                        havePhoto={post.selectedFile.length !== 0}
                      />
                    </motion.li>
                  ))
                ) : (
                  <motion.li
                    key="all-caught-up"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center justify-center text-center text-2xl font-medium"
                  >
                    All Caught up!
                  </motion.li>
                )
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
                  Array.from(Array(2), (_, i) => (
                    <PostSkeleton key={`post-loading-${userId}-${i}`} />
                  ))}
              </li>
            )}
          </InView>
        </AnimatePresence>
      </ul>
    </>
  )
}

export default Posts
