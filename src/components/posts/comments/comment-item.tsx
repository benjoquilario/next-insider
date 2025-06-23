"use client"

import React from "react"
import type { Comment } from "@/types"
import { User } from "@/generated/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { motion } from "framer-motion"

interface CommentItemProps {
  comment: Comment<User>
  postId: string
}

const CommentItem = React.memo(({ comment, postId }: CommentItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const selectedComment = useCommentStore((state) => state.selectedComment)
  const setSelectedComment = useCommentStore(
    (state) => state.setSelectedComment
  )
  const [isRepliesOpen, setIsRepliesOpen] = React.useState(false)

  const {
    comment: userComment,
    createdAt,
    haveReplies,
    id,
    isEdited,
    isLiked,
    isUserComment,
    user,
    _count,
  } = comment

  const { comment: commentText, commentId } = selectedComment

  const { likeCommentMutation, unlikeCommentMutation } = useLikeCommentMutation(
    {
      postId,
      commentId: comment.id,
      content: comment.comment,
    }
  )

  const handleAlertOpen = React.useCallback(() => {
    setIsAlertOpen(true)
  }, [])

  const handleOnAction = React.useCallback(() => {
    setIsEditing(true)

    setSelectedComment({
      commentId: comment.id,
      comment: userComment,
    })
  }, [comment.id, userComment, setSelectedComment])

  const handleLikeComment = React.useCallback(
    (isLiked: boolean) => {
      !isLiked ? likeCommentMutation.mutate() : unlikeCommentMutation.mutate()
    },
    [likeCommentMutation, unlikeCommentMutation]
  )

  const { deleteCommentMutation } = useDeleteComment({ postId })

  const handleDeleteComment = React.useCallback(() => {
    deleteCommentMutation.mutate({ commentId: id })
  }, [deleteCommentMutation, id])

  const handleOpenReplies = React.useCallback(() => {
    setIsRepliesOpen(true)
  }, [])

  // Animation variants for the comment container
  const commentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  return (
    <motion.div
      layout
      variants={commentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex pt-1 pl-4"
    >
      {/* Avatar and reply line */}
      <div className="relative mt-1 mr-2 block rounded-full">
        {comment.haveReplies || isRepliesOpen ? (
          <div className="bg-input absolute top-[30px] left-[18px] h-[calc(100%_-_61px)] w-[2px]"></div>
        ) : null}
        <Link
          href={`/profile/${user.id}`}
          className="relative inline-block w-full shrink basis-auto items-stretch"
        >
          <Avatar className="size-8">
            <AvatarImage
              src={user.image ?? "/default-image.png"}
              alt={`@${user.name}`}
              className="size-8"
            />
            <AvatarFallback>
              <div className="bg-primary/10 size-full animate-pulse"></div>
            </AvatarFallback>
          </Avatar>
          <div className="pointer-events-none absolute inset-0 rounded-full"></div>
        </Link>
      </div>
      {/* Main comment content */}
      <div className="grow basis-0 pr-2 md:mr-10 md:pr-4">
        <div>
          <div className="inline-block w-full max-w-[calc(100%_-_26px] break-words">
            <div className="flex w-full items-center justify-between">
              <span className="inline-flex flex-col">
                <Link className="inline" href={`/profile/${user.id}`}>
                  <span className="inline-flex">
                    <span className="text-foreground max-w-full text-sm font-medium capitalize underline-offset-1 hover:underline">
                      {user?.name}
                    </span>
                  </span>
                </Link>
                <span className="text-foreground/70 text-[11px]">
                  {dayjs(createdAt).fromNow()}
                </span>
              </span>

              {isUserComment ? (
                <DropdownAction
                  className=""
                  onAction={handleOnAction}
                  onAlertOpen={handleAlertOpen}
                />
              ) : null}
            </div>
            {isEditing ? (
              <EditComment
                isEditing={isEditing}
                commentId={commentId}
                postId={postId}
                comment={commentText}
                setIsEditing={setIsEditing}
              />
            ) : (
              <div className="relative my-1.5 inline-flex w-full align-middle">
                <div className="base-[auto] w-full min-w-0 shrink grow">
                  <div className="text-foreground relative inline-block max-w-full rounded break-words whitespace-normal">
                    <div>
                      <div className="block py-[4px]">
                        <span className="break-words">
                          <div className="text-sm">
                            <div dir="auto" className="text-start font-sans">
                              {userComment}
                            </div>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="text-muted-foreground/70 mt-1 ml-1 flex items-center gap-2 text-xs font-semibold">
              <LikeComment
                handleLikeComment={handleLikeComment}
                isLiked={isLiked}
              />
              <button
                type="button"
                onClick={handleOpenReplies}
                className="underline-offset-1 hover:underline"
              >
                Reply
              </button>
              {isEdited ? (
                <span className="text-muted-foreground/60 text-xs font-light">
                  Edited
                </span>
              ) : null}
              <div className="bg-background relative flex items-center gap-1 rounded-full px-1 shadow">
                {isLiked || _count.commentLike > 0 ? (
                  <>
                    <div className="bg-primary flex size-4 items-center justify-center rounded-full">
                      <IoMdHeart size={12} className="text-white" />
                    </div>
                    <span className="text-foreground/70 text-sm font-medium">
                      {_count.commentLike}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <div className="relative mt-2">
              {haveReplies ? (
                <>
                  <div className="border-l-input border-t-input absolute bottom-[12px] left-[-22px] h-[21px] w-[29px] rounded-l border-b-2 border-l-2 md:w-[27px]"></div>
                  <Button
                    variant="ghost"
                    onClick={handleOpenReplies}
                    aria-label="show replies"
                    size="sm"
                    className="flex items-center gap-1 text-xs font-semibold underline-offset-1 hover:underline"
                  >
                    <span>
                      <CornerDownRight className="text-muted-foreground" />
                    </span>
                    <span>{_count.replyComment} replies</span>
                  </Button>
                </>
              ) : null}
            </div>
          </div>
          {isRepliesOpen && <Replies commentId={id} />}
        </div>
      </div>
      <DeleteDialog
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        id={id}
        description="This action cannot be undone. This will permanently delete your\n              comment and remove your data from our servers."
        onHandleDelete={handleDeleteComment}
        isDisabled={deleteCommentMutation.isPending}
      />
    </motion.div>
  )
})

CommentItem.displayName = "CommentItem"

export default CommentItem
