"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

import { Button } from "@/components/ui/button"
import { IoMdShareAlt } from "react-icons/io"
import { IoMdHeart } from "react-icons/io"
import type { IPost } from "@/types"
// import type { User } from "@prisma/client"
import { useUnlikeMutation } from "@/hooks/mutation/posts/use-unlike-post"
import { useLikePostMutation } from "@/hooks/mutation/posts/use-like-post"
import LikePost from "./like/like-post"
import Comments from "./comments"
import { MessageCircle } from "lucide-react"
import DropdownAction from "./dropdown-action"
import Image from "next/image"
import dayjs from "@/lib/time"
import usePostStore from "@/store/post"
import DeleteDialog from "./delete-dialog"
import { useDeletePost } from "@/hooks/mutation/posts/use-delete-post"
import { type User } from "@prisma/client"
import * as React from "react"

interface PostItemProps {
  post: IPost<User>
  havePhoto: boolean
  isUserPost: boolean
  userId?: string
}

const PostItem = React.memo(
  ({ post, havePhoto, isUserPost = true, userId }: PostItemProps) => {
    const [isCommentOpen, setIsCommentOpen] = React.useState(false)
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const setIsUpdating = usePostStore((state) => state.setIsUpdating)
    const setIsPostOpen = usePostStore((state) => state.setIsPostOpen)
    const setSelectedPost = usePostStore((state) => state.setSelectedPost)
    const { unlikePostMutation } = useUnlikeMutation({
      postId: post.id,
      userId,
    })
    const { likePostMutation } = useLikePostMutation({
      postId: post.id,
      content: post.content,
      userId,
    })

    const handleLikePost = React.useCallback(
      (isLiked: boolean) =>
        !isLiked ? likePostMutation.mutate() : unlikePostMutation.mutate(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )

    const handleOnAlertOpen = () => {
      setIsAlertOpen(true)
    }

    const handleOnAction = () => {
      setIsPostOpen(true)
      setIsUpdating(true)

      setSelectedPost({
        postId: post.id,
        content: post.content,
        selectedFile: post.selectedFile,
      })
    }

    const { deletePostMutation } = useDeletePost(userId)

    const handlDeletePost = () => {
      deletePostMutation.mutate({ postId: post.id })
    }

    return (
      <>
        <div className="flex gap-3 p-3">
          <Link
            href={`/profile/`}
            className={cn(
              "focus-visible:outline-offset-3 rounded-full ring-primary ring-offset-1 focus-visible:outline-primary focus-visible:ring-primary active:ring"
            )}
          >
            <Avatar>
              <AvatarImage src={"/default-image.png"} alt={""} />
              <AvatarFallback>
                <div className="size-full animate-pulse"></div>
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="mr-auto flex flex-col gap-1 self-center leading-none">
            <div className="flex items-center gap-3">
              <Link
                href={`/profile/`}
                className={cn(
                  "block text-[15px] font-bold capitalize text-foreground/60 underline-offset-1 hover:underline"
                )}
              >
                {post.user.name}
              </Link>
            </div>

            <span className="text-[13px] text-muted-foreground/80">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </div>
          {isUserPost ? (
            <DropdownAction
              className="self-end"
              onAlertOpen={handleOnAlertOpen}
              onAction={handleOnAction}
            />
          ) : null}
        </div>
        <div className="px-3 font-normal md:px-5">
          <span
            className={cn(
              "break-words text-base text-foreground/80",
              havePhoto ? "text-base" : "text-2xl"
            )}
          >
            {post.content}
          </span>
          {post.selectedFile.length !== 0 && (
            <div
              className={cn(
                "relative grid gap-1",
                post.selectedFile.length > 1 && "!grid-cols-2"
              )}
            >
              {post.selectedFile.map((image, index) => {
                return (
                  <div
                    key={image.url}
                    className={cn(
                      "relative cursor-pointer overflow-hidden rounded",
                      post.selectedFile.length === 3 &&
                        index === 0 &&
                        "col-span-2",
                      post.selectedFile.length === 3 &&
                        index === 2 &&
                        "self-end"
                    )}
                  >
                    <div
                      className="relative h-full cursor-pointer active:opacity-80"
                      tabIndex={0}
                      role="button"
                    >
                      <div className="h-60 w-full md:h-96">
                        <Image
                          src={image.url}
                          style={{ objectFit: "cover" }}
                          alt={image.url}
                          fill
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between px-5">
          <div className="flex items-center gap-1 text-sm text-foreground">
            <span className="flex size-5 items-center justify-center rounded-full bg-primary">
              <IoMdHeart
                aria-hidden
                className="size-4 text-primary-foreground"
              />
            </span>

            <span className="font-medium text-foreground/60">
              {post._count.likePost}
            </span>
          </div>
          <div className="flex gap-1 text-sm font-semibold text-muted-foreground/80">
            <span>{post._count.comment}</span>
            <MessageCircle aria-hidden size={20} />
          </div>
        </div>
        <ul className="rou mx-1 mt-1 flex justify-between rounded-t-md border-t border-l-secondary/40 font-light">
          <li className="w-full flex-1 py-1">
            <LikePost isLiked={post.isLiked} handleLikePost={handleLikePost} />
          </li>

          <li className="w-full flex-1 py-1">
            <Button
              // type="button"
              onClick={() => setIsCommentOpen(true)}
              variant="ghost"
              className={cn(
                "flex h-[35px] w-full items-center justify-center gap-1 text-foreground/60 hover:bg-secondary",
                "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary",
                isCommentOpen && "bg-secondary"
              )}
              aria-label="Leave a Comment"
            >
              <MessageCircle
                aria-hidden="true"
                className="size-5 text-foreground/90"
              />
              <span className="text-foreground-80 text-sm font-semibold">
                Comment
              </span>
            </Button>
          </li>
          <li className="w-full flex-1 py-1">
            <Button
              variant="ghost"
              type="button"
              aria-label="Share a post"
              className={cn(
                "flex h-[35px] w-full items-center justify-center gap-1 rounded-md text-foreground/60 hover:bg-secondary",
                "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
              )}
            >
              <IoMdShareAlt
                aria-hidden="true"
                size={20}
                className="text-foreground/90"
              />
              <span className="text-sm font-semibold text-foreground/80">
                Share
              </span>
            </Button>
          </li>
        </ul>
        <DeleteDialog
          id={post.id}
          isAlertOpen={isAlertOpen}
          setIsAlertOpen={setIsAlertOpen}
          isDisabled={deletePostMutation.isPending}
          onHandleDelete={handlDeletePost}
          description="This action cannot be undone. This will permanently delete your post
            and remove your data from our servers."
        />
        {/* <DeletePost
          postId={post.id}
          setIsAlertOpen={setIsAlertOpen}
          isAlertOpen={isAlertOpen}
        /> */}
        {isCommentOpen ? <Comments postId={post.id} /> : null}
      </>
    )
  }
)

PostItem.displayName = "PostItem"

export default PostItem
