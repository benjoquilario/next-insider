import React from "react"
import { motion } from "framer-motion"
import CreateComment from "./view-comments"

interface CommentsProps {
  postId: string
}

export const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
}

const Comments = React.memo(({ postId }: CommentsProps) => {
  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative rounded"
    >
      <CreateComment postId={postId} />
    </motion.div>
  )
})

Comments.displayName = "Comments"

export default Comments
