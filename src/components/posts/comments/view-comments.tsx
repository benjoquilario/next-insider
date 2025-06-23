"use client"

import React, { useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { LoaderCircle } from "lucide-react"
import { type Comment } from "@/types"
import { type User } from "@/generated/prisma"
import { Button } from "@/components/ui/button"
import CommentItem from "./comment-item"
import CreateComment from "./create-comment"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ViewCommentsProps {
  postId: string
}

const commentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const ViewComments = ({ postId }: ViewCommentsProps) => {
  const {
    data: comments,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) =>
      fetch(`/api/comments/${postId}?limit=3&cursor=${pageParam}`).then((res) =>
        res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  // Flatten comments for easier mapping
  const allComments = useMemo(
    () => comments?.pages.flatMap((page) => page?.data || []) || [],
    [comments]
  )

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-4">
        <LoaderCircle className="size-6 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-destructive flex items-center justify-center py-4">
        Failed to load comments.
      </div>
    )
  }

  return (
    <div className="pb-4" id="comment">
      <Card className="rounded-t-none rounded-tl-none rounded-tr-none">
        <CardContent className="p-0">
          <ul>
            <AnimatePresence initial={false}>
              {allComments.length === 0 && (
                <motion.li
                  key="no-comments"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground py-4 text-center"
                >
                  No comments yet.
                </motion.li>
              )}
              {allComments.map((comment: Comment<User>, idx) => (
                <motion.li
                  key={comment.id}
                  variants={commentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    duration: 0.25,
                    delay: idx * 0.05,
                    ease: "easeInOut",
                  }}
                >
                  <CommentItem comment={comment} postId={postId} />
                </motion.li>
              ))}
            </AnimatePresence>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-4">
                <LoaderCircle className="text-foreground animate-spin text-2xl" />
              </div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <li className="ml-4">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => fetchNextPage()}
                  className="underline-offset-1 hover:underline"
                >
                  View more comments
                </Button>
              </li>
            )}
          </ul>
        </CardContent>
        <CardFooter>
          <div className="px-3 pt-4 md:px-5">
            <CreateComment postId={postId} />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ViewComments
