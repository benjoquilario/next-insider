"use client"

import React from "react"
import type { Comment } from "@/types"
import { User } from "@prisma/client"
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

  const handleAlertOpen = () => {
    setIsAlertOpen(true)
  }

  const handleOnAction = () => {
    setIsEditing(true)

    setSelectedComment({
      commentId: comment.id,
      comment: userComment,
    })
  }

  const handleLikeComment = React.useCallback(
    (isLiked: boolean) =>
      !isLiked ? likeCommentMutation.mutate() : unlikeCommentMutation.mutate(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { deleteCommentMutation } = useDeleteComment({ postId })

  console.log(isAlertOpen)

  const handleDeleteComment = () => {
    deleteCommentMutation.mutate({ commentId: id })
  }

  return (
    <>
      <div className="relative flex pl-4 pt-1">
        <div className="relative mr-2 mt-1 block rounded-full">
          {comment.haveReplies || isRepliesOpen ? (
            <div className="absolute left-[18px] top-[30px] h-[calc(100%_-_61px)] w-[2px] bg-input"></div>
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
                <div className="size-full animate-pulse bg-primary/10"></div>
              </AvatarFallback>
            </Avatar>
            <div className="pointer-events-none absolute inset-0 rounded-full"></div>
          </Link>
        </div>

        <div className="grow basis-0 pr-2 md:mr-10 md:pr-4">
          <div>
            <div
              className="max-w-[calc(100%_-_26px] inline-block w-full break-words"
              style={{ wordBreak: "break-word" }}
            >
              <div className="flex w-full items-center justify-between">
                <span className="inline-flex flex-col">
                  <Link className="inline" href={`/profile/${user.id}`}>
                    <span className="inline-flex">
                      <span
                        className="max-w-full text-sm font-medium capitalize text-foreground underline-offset-1 hover:underline"
                        style={{ wordBreak: "break-word" }}
                      >
                        {user?.name}
                      </span>
                    </span>
                  </Link>
                  <span className="text-[11px] text-foreground/70">
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
                    <div
                      className="relative inline-block max-w-full whitespace-normal break-words rounded text-foreground"
                      style={{ wordBreak: "break-word" }}
                    >
                      <div>
                        <div className="block py-[4px]">
                          <span
                            className="break-words"
                            style={{ wordBreak: "break-word" }}
                          >
                            <div
                              className="text-sm"
                              style={{ wordBreak: "break-word" }}
                            >
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
              <div className="ml-1 mt-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground/70">
                <LikeComment
                  handleLikeComment={handleLikeComment}
                  isLiked={isLiked}
                />
                <button
                  type="button"
                  onClick={() => setIsRepliesOpen(true)}
                  className="underline-offset-1 hover:underline"
                >
                  Reply
                </button>
                {isEdited ? (
                  <span className="text-xs font-light text-muted-foreground/60">
                    Edited
                  </span>
                ) : null}
                <div className="relative flex items-center gap-1 rounded-full bg-background px-1 shadow">
                  {isLiked || _count.commentLike > 0 ? (
                    <>
                      <div className="flex size-4 items-center justify-center rounded-full bg-primary">
                        <IoMdHeart size={12} className="text-white" />
                      </div>

                      <span className="text-sm font-medium text-foreground/70">
                        {_count.commentLike}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="relative mt-2">
                {haveReplies ? (
                  <>
                    <div className="absolute bottom-[12px] left-[-22px] h-[21px] w-[29px] rounded-l border-b-2 border-l-2 border-l-input border-t-input md:w-[27px]"></div>
                    <Button
                      variant="ghost"
                      onClick={() => setIsRepliesOpen(true)}
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
      </div>
      <DeleteDialog
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        id={id}
        description="This action cannot be undone. This will permanently delete your
              comment and remove your data from our servers."
        onHandleDelete={handleDeleteComment}
        isDisabled={deleteCommentMutation.isPending}
      />
    </>
  )
})

CommentItem.displayName = "CommentItem"

export default CommentItem
