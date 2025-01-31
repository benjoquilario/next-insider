"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"

interface LikePostProps {
  isLiked: boolean
  handleLikePost: (isLiked: boolean) => void
}

const LikePost = ({ isLiked, handleLikePost }: LikePostProps) => {
  return (
    <Button
      type="button"
      className={cn(
        "text-muted-foreground-600 flex h-[35px] w-full items-center justify-center gap-1 rounded-md hover:bg-secondary active:scale-110",
        "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
      )}
      variant="ghost"
      aria-label="Like Post"
      onClick={() => handleLikePost(isLiked)}
    >
      <span>
        {isLiked ? (
          <IoMdHeart aria-hidden="true" className="size-4 text-primary" />
        ) : (
          <IoMdHeartEmpty aria-hidden="true" className="size-4" />
        )}
      </span>
      <span
        className={cn(
          "text-sm",
          isLiked ? "font-bold text-primary" : "font-medium text-foreground"
        )}
      >
        Like
      </span>
    </Button>
  )
}
export default LikePost
