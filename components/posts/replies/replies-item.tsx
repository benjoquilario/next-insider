"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IoMdHeart } from "react-icons/io"
import { type ReplyComment } from "@/types"
import { type User } from "@/lib/generated/prisma"
import dayjs from "@/lib/time"
import EditReplies from "./edit-replies"
import useRepliesStore from "@/store/replies"
import LikeComment from "@/components/posts/comments/like-comment"
import DropdownAction from "@/components/posts/dropdown-action"
import { useLikeReplyCommentMutation } from "@/hooks/mutation/replies/use-like-replies"
import DeleteDialog from "../delete-dialog"
import * as React from "react"
import { useDeleteReplies } from "@/hooks/mutation/replies/use-delete-replies"

interface RepliesItemProps {
  replies: ReplyComment<User>
  commentId: string
}

const RepliesItem = ({ replies, commentId }: RepliesItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const selectedReplies = useRepliesStore((state) => state.selectedReplies)
  const setSelectedReplies = useRepliesStore(
    (state) => state.setSelectedReplies
  )

  const {
    content: userReply,
    _count,
    createdAt,
    id,
    isEdited,
    isLiked,
    isUserReplies,
    user,
    userId,
  } = replies

  const { content, repliesId } = selectedReplies

  const handleAlertOpen = () => {
    setIsAlertOpen(true)
  }

  const handleOnAction = () => {
    setIsEditing(true)

    setSelectedReplies({
      repliesId: id,
      content: userReply,
    })
  }

  const { likeReplyCommentMutation, unlikeReplyCommentMutation } =
    useLikeReplyCommentMutation({
      replyId: id,
      commentId,
      content: userReply,
    })

  const handleLikeComment = React.useCallback(
    (isLiked: boolean) =>
      !isLiked
        ? likeReplyCommentMutation.mutate()
        : unlikeReplyCommentMutation.mutate(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { deleteReplyMutation } = useDeleteReplies({ commentId })

  const handleDeleteReply = () => {
    deleteReplyMutation.mutate({ replyId: replies.id })
  }

  return (
    <>
      <div className="relative flex pt-1 pl-4">
        <div className="relative mt-1 mr-2 block rounded-full">
          {/* {isReplyOpen || comment._count.reply > 0 ? (
            <div className="absolute left-[18px] top-[30px] h-[calc(100%_-_61px)] w-[2px] bg-gray-300"></div>
          ) : null} */}
          <div className="bg-input absolute top-[15px] left-[-38px] h-[2px] w-[45px]"></div>
          <span className="inline">
            <Link
              href={`/profile/`}
              className="relative inline-block w-full shrink basis-auto items-stretch"
              // aria-label={comment.user?.name}
            >
              <Avatar className="size-6">
                <AvatarImage
                  src={"/default-image.png"}
                  alt={`@`}
                  className="size-6"
                />
                <AvatarFallback>
                  <div className="bg-primary/10 size-full animate-pulse"></div>
                </AvatarFallback>
              </Avatar>
              <div className="pointer-events-none absolute inset-0 rounded-full"></div>
            </Link>
          </span>
        </div>

        <div className="grow basis-0 overflow-hidden pr-2 md:pr-4">
          <div>
            <div
              className="inline-block w-full max-w-[calc(100%_-_26px] break-words"
              style={{ wordBreak: "break-word" }}
            >
              <div className="flex w-full items-center justify-between">
                <span className="inline-flex flex-col">
                  <Link className="inline" href={`/profile/${userId}`}>
                    <span className="inline-flex">
                      <span
                        className="text-foreground max-w-full text-sm font-medium capitalize underline-offset-1 hover:underline"
                        style={{ wordBreak: "break-word" }}
                      >
                        {user?.name}
                      </span>
                    </span>
                  </Link>
                  <span className="text-foreground/70 text-[11px]">
                    {dayjs(createdAt).fromNow(true)}
                  </span>
                </span>
                {isUserReplies ? (
                  <DropdownAction
                    className=""
                    onAction={handleOnAction}
                    onAlertOpen={handleAlertOpen}
                  />
                ) : null}
              </div>

              {isEditing ? (
                <EditReplies
                  id={repliesId}
                  content={content}
                  commentId={commentId}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              ) : (
                <>
                  <div className="relative my-1.5 inline-flex w-full align-middle">
                    <div className="base-[auto] w-full min-w-0 shrink grow">
                      <div
                        className="text-foreground relative inline-block max-w-full rounded break-words whitespace-normal"
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
                                <div
                                  dir="auto"
                                  className="text-start font-sans"
                                >
                                  {userReply}
                                </div>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="text-muted-foreground/70 mt-1 ml-1 flex items-center gap-2 text-xs font-semibold">
                <LikeComment
                  handleLikeComment={handleLikeComment}
                  isLiked={isLiked}
                />
                {isEdited ? (
                  <span className="text-muted-foreground/60 text-xs font-light">
                    Edited
                  </span>
                ) : null}

                <div className="bg-background relative flex items-center gap-1 rounded-full px-1 shadow">
                  {isLiked || _count.likeReplyComment > 0 ? (
                    <>
                      <div className="bg-primary flex size-4 items-center justify-center rounded-full">
                        <IoMdHeart size={12} className="text-white" />
                      </div>

                      <span className="text-foreground/70 text-sm font-medium">
                        {_count.likeReplyComment}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-0 w-1/2"></div>
      </div>

      <DeleteDialog
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        id={replies.id}
        description="This action cannot be undone. This will permanently delete your
              replies and remove your data from our servers."
        onHandleDelete={handleDeleteReply}
        isDisabled={deleteReplyMutation.isPending}
      />
    </>
  )
}
export default RepliesItem
