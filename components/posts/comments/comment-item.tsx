"use client"

import React from "react"
import type { Comment } from "@/types"
import { User } from "@/lib/generated/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IoMdHeart } from "react-icons/io"
import Link from "next/link"
import useCommentStore from "@/store/comment"
import { CornerDownRight } from "lucide-react"
import EditComment from "./edit-comment"
import LikeComment from "./like-comment"
import { useLikeCommentMutation } from "@/hooks/mutation/comments/use-like-comment"
import dayjs from "@/lib/time"
import DropdownAction from "../dropdown-action"
import DeleteDialog from "../delete-dialog"
import { useDeleteComment } from "@/hooks/mutation/comments/use-delete-comment"
import Replies from "../replies"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CommentItemProps {
  comment: Comment<User>
  postId: string
}

// Separate component for user info
const UserInfo = React.memo(
  ({ user, createdAt }: { user: User; createdAt: string }) => (
    <div className="flex flex-col">
      <Link
        href={`/profile/${user.id}`}
        className="text-foreground text-sm font-medium capitalize underline-offset-1 transition-colors hover:underline"
      >
        {user?.name}
      </Link>
      <span className="text-muted-foreground text-xs">
        {dayjs(createdAt).fromNow()}
      </span>
    </div>
  )
)

UserInfo.displayName = "UserInfo"

// Separate component for comment content
const CommentContent = React.memo(({ content }: { content: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
    className="my-2"
  >
    <div className="text-foreground text-sm leading-relaxed break-words">
      {content}
    </div>
  </motion.div>
))

CommentContent.displayName = "CommentContent"

// Separate component for like counter
const LikeCounter = React.memo(
  ({ isLiked, likeCount }: { isLiked: boolean; likeCount: number }) => {
    if (!isLiked && likeCount === 0) return null

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-background flex items-center gap-1 rounded-full border px-2 py-1 shadow-sm"
      >
        <div className="bg-primary flex size-4 items-center justify-center rounded-full">
          <IoMdHeart size={10} className="text-white" />
        </div>
        <span className="text-foreground text-xs font-medium">{likeCount}</span>
      </motion.div>
    )
  }
)

LikeCounter.displayName = "LikeCounter"

// Separate component for comment actions
const CommentActions = React.memo(
  ({
    isLiked,
    onLike,
    onReply,
    isEdited,
  }: {
    isLiked: boolean
    onLike: (isLiked: boolean) => void
    onReply: () => void
    isEdited: boolean
  }) => (
    <div className="mt-2 flex items-center gap-3">
      <LikeComment handleLikeComment={onLike} isLiked={isLiked} />
      <Button
        variant="ghost"
        size="sm"
        onClick={onReply}
        className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs font-medium transition-colors"
      >
        Reply
      </Button>
      {isEdited && (
        <Badge variant="secondary" className="text-xs font-light">
          Edited
        </Badge>
      )}
    </div>
  )
)

CommentActions.displayName = "CommentActions"

// Separate component for replies section
const RepliesSection = React.memo(
  ({
    haveReplies,
    replyCount,
    onShowReplies,
  }: {
    haveReplies: boolean
    replyCount: number
    onShowReplies: () => void
  }) => {
    if (!haveReplies) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-3"
      >
        <div className="border-muted absolute bottom-3 left-[-27px] h-6 w-8 rounded-bl-lg border-b-2 border-l-2 md:left-[-28px]" />
        <Button
          variant="ghost"
          onClick={onShowReplies}
          size="sm"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs font-medium transition-colors"
        >
          <CornerDownRight size={14} />
          <span>
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </span>
        </Button>
      </motion.div>
    )
  }
)

RepliesSection.displayName = "RepliesSection"

const CommentItem = React.memo(({ comment, postId }: CommentItemProps) => {
  // State management
  const [isEditing, setIsEditing] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [isRepliesOpen, setIsRepliesOpen] = React.useState(false)

  // Store hooks
  const selectedComment = useCommentStore((state) => state.selectedComment)
  const setSelectedComment = useCommentStore(
    (state) => state.setSelectedComment
  )

  // Destructure comment data
  const {
    comment: userComment,
    createdAt,
    haveReplies,
    id: commentId,
    isEdited,
    isLiked,
    isUserComment,
    user,
    _count,
  } = comment

  const { comment: commentText, commentId: selectedCommentId } = selectedComment

  // Mutation hooks
  const { likeCommentMutation, unlikeCommentMutation } = useLikeCommentMutation(
    {
      postId,
      commentId: comment.id,
      content: comment.comment,
    }
  )

  const { deleteCommentMutation } = useDeleteComment({ postId })

  // Event handlers
  const handleEditComment = React.useCallback(() => {
    setIsEditing(true)
    setSelectedComment({
      commentId: comment.id,
      comment: userComment,
    })
  }, [comment.id, userComment, setSelectedComment])

  const handleLikeComment = React.useCallback(
    (isCurrentlyLiked: boolean) => {
      const mutation = isCurrentlyLiked
        ? unlikeCommentMutation
        : likeCommentMutation
      mutation.mutate()
    },
    [likeCommentMutation, unlikeCommentMutation]
  )

  const handleDeleteComment = React.useCallback(() => {
    deleteCommentMutation.mutate({ commentId })
  }, [deleteCommentMutation, commentId])

  const handleShowReplies = React.useCallback(() => {
    setIsRepliesOpen(true)
  }, [])

  const handleOpenDeleteDialog = React.useCallback(() => {
    setIsAlertOpen(true)
  }, [])

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  const shouldShowReplyLine = haveReplies || isRepliesOpen

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative"
    >
      <Card
        className={cn(
          "border-0 bg-transparent shadow-none",
          "hover:bg-muted/30 transition-colors duration-200"
        )}
      >
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              {shouldShowReplyLine && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "calc(100% - 69px)" }}
                  className="bg-border absolute top-10 left-4 w-0.5"
                />
              )}

              <Link href={`/profile/${user.id}`} className="block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <Avatar className="ring-background size-8 shadow-sm ring-2">
                    <AvatarImage
                      src={user.image ?? "/default-image.png"}
                      alt={`@${user.name}`}
                    />
                    <AvatarFallback>
                      <div className="bg-primary/10 size-full animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </Link>
            </div>

            {/* Content Section */}
            <div className="min-w-0 flex-1">
              {/* Header */}
              <div className="flex items-start justify-between">
                <UserInfo user={user} createdAt={createdAt.toString()} />

                {isUserComment && (
                  <DropdownAction
                    onAction={handleEditComment}
                    onAlertOpen={handleOpenDeleteDialog}
                  />
                )}
              </div>

              {/* Comment Content */}
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <EditComment
                      isEditing={isEditing}
                      commentId={selectedCommentId}
                      postId={postId}
                      comment={commentText}
                      setIsEditing={setIsEditing}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <CommentContent content={userComment} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <CommentActions
                  isLiked={isLiked}
                  onLike={handleLikeComment}
                  onReply={handleShowReplies}
                  isEdited={isEdited}
                />

                <LikeCounter isLiked={isLiked} likeCount={_count.commentLike} />
              </div>

              {/* Replies Section */}
              <RepliesSection
                haveReplies={haveReplies}
                replyCount={_count.replyComment}
                onShowReplies={handleShowReplies}
              />

              {/* Replies Component */}
              <AnimatePresence>
                {isRepliesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <Replies commentId={commentId} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <DeleteDialog
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        id={commentId}
        description="This action cannot be undone. This will permanently delete your comment and remove your data from our servers."
        onHandleDelete={handleDeleteComment}
        isDisabled={deleteCommentMutation.isPending}
      />
    </motion.div>
  )
})

CommentItem.displayName = "CommentItem"

export default CommentItem
