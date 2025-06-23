"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { useState, memo } from "react"
import { likePost, unlikePost } from "@/server/like"

interface LikePostProps {
  isLiked: boolean
  postId: string
  likeCounts: number
  content: string
}

const LikePost = ({ isLiked, likeCounts, postId, content }: LikePostProps) => {
  const [isLikedState, setIsLikedState] = useState(isLiked)
  const [likeCountsState, setLikeCountsState] = useState(likeCounts)

  console.log(likeCounts)

  const handleLikePost = async () => {
    if (!isLikedState) {
      setLikeCountsState(likeCountsState + 1)
      setIsLikedState(true)
      await likePost({
        postId,
        content,
      })

      console.log("Post liked")
    } else {
      setLikeCountsState(likeCountsState - 1)
      setIsLikedState(false)
      await unlikePost({
        postId,
      })
      console.log("Post unliked")
    }
  }

  return (
    <Button
      type="button"
      className={cn(
        "text-muted-foreground-600 flex h-[35px] w-full items-center justify-center gap-1 rounded-md hover:bg-secondary active:scale-110",
        "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
      )}
      variant="ghost"
      aria-label="Like Post"
      onClick={handleLikePost}
    >
      <span
        className={cn(
          "text-sm flex items-center gap-1",
          isLikedState ? "font-bold text-primary" : "text-foreground"
        )}
      >
        {likeCountsState}

        {isLikedState ? (
          <IoMdHeart aria-hidden="true" className="size-4 text-primary" />
        ) : (
          <IoMdHeartEmpty aria-hidden="true" className="size-4" />
        )}
      </span>
    </Button>
  )
}

export default memo(LikePost)
