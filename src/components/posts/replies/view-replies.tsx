"use client"

import React from "react"
import ReplyItem from "./replies-item"
import { useInfiniteQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import type { User } from "@/generated/prisma"
import { ImSpinner8 } from "react-icons/im"
import { Button } from "@/components/ui/button"
import { type ReplyComment } from "@/types"
import CreateReplies from "./create-replies"

interface ViewRepliesProps {
  commentId: string
}

const ViewReplies = ({ commentId }: ViewRepliesProps) => {
  const {
    data: comments,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["replies", commentId],
    queryFn: ({ pageParam }) =>
      fetch(`/api/replies/${commentId}?limit=${3}&cursor=${pageParam}`).then(
        (res) => res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  console.log(comments)

  return isPending ? (
    <div className="flex w-full animate-spin items-center justify-center py-2">
      <ImSpinner8 className="size-4" />
    </div>
  ) : (
    <div>
      <ul>
        {comments?.pages.map((page) =>
          page?.data.map((reply: ReplyComment<User>) => (
            <motion.li
              key={reply.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReplyItem replies={reply} commentId={commentId} />
            </motion.li>
          ))
        )}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <ImSpinner8 className="text-foreground animate-spin text-2xl" />
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
      <div className="px-3 pt-1 md:px-5">
        <CreateReplies commentId={commentId} />
      </div>
    </div>
  )
}

export default ViewReplies
