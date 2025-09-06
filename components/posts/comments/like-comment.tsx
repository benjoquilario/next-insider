"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LikeCommentProps {
  isLiked: boolean
  handleLikeComment: (isLiked: boolean) => void
}

const LikeComment = ({ isLiked, handleLikeComment }: LikeCommentProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleLikeComment(isLiked)}
      className={cn(
        "text-muted-foreground hover:text-foreground h-auto p-0 text-xs font-medium transition-colors",
        isLiked && "text-primary font-bold"
      )}
    >
      Like
    </Button>
  )
}
export default LikeComment
