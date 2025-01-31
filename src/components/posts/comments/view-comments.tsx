"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { LoaderCircle } from "lucide-react"
import { type Comment } from "@/types"
import { type User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import CommentItem from "./comment-item"
import CreateComment from "./create-comment"

interface ViewCommentsProps {
  postId: string
}

const ViewComments = ({ postId }: ViewCommentsProps) => {
  const {
    data: comments,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) =>
      fetch(`/api/comments/${postId}?limit=${3}&cursor=${pageParam}`).then(
        (res) => res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  console.log(comments)

  return isPending ? (
    <div className="flex animate-spin items-center justify-center py-4">
      <LoaderCircle className="size-6" />
    </div>
  ) : (
    <div className="pb-4" id="comment">
      <ul>
        {comments?.pages.map((page) =>
          page?.data.map((comment: Comment<User>) => (
            <motion.li
              key={comment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommentItem comment={comment} postId={postId} />
            </motion.li>
          ))
        )}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <LoaderCircle className="animate-spin text-2xl text-foreground" />
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
      <div className="px-3 pt-4 md:px-5">
        <CreateComment postId={postId} />
      </div>
    </div>
  )
}

export default ViewComments
