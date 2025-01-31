"use client"

import { cn } from "@/lib/utils"

interface LikeCommentProps {
  isLiked: boolean
  handleLikeComment: (isLiked: boolean) => void
}

const LikeComment = ({ isLiked, handleLikeComment }: LikeCommentProps) => {
  return (
    <button
      type="button"
      onClick={() => handleLikeComment(isLiked)}
      className={cn(
        "underline-offset-1 hover:underline",
        isLiked && "font-bold text-primary"
      )}
    >
      Like
    </button>
  )
}
export default LikeComment
