import React from "react"
import { variants } from "@/components/posts/comments"
import { motion } from "framer-motion"
import ViewReplies from "./view-replies"

const Replies = React.memo(({ commentId }: { commentId: string }) => {
  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative rounded"
    >
      <ViewReplies commentId={commentId} />
    </motion.div>
  )
})

Replies.displayName = "Replies"

export default Replies
