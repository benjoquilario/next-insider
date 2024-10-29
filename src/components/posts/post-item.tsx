"use client"

import React, { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import { IoMdShareAlt } from "react-icons/io"
import Comments from "../comments"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import usePostStore from "@/store/post"
import type { User } from "@prisma/client"
import { useUpdateDeleteMutation } from "@/hooks/useUpdateDeletePost"
import Image from "next/image"
import { useLikePostMutation } from "@/hooks/useLikePost"
import { getImageHeightRatio, getImageWidthRatio } from "@/lib/utils"
import { VscCommentDiscussion } from "react-icons/vsc"
import { BiSolidLike } from "react-icons/bi"
import dayjs from "@/lib/time"
import { useFolloMutation } from "@/hooks/useFollowMutation"

export type PostItemProps = {
  post: IPost<User>
  userId?: string
  isUserPost: boolean
}

const PostItem = (props: PostItemProps) => {
  const { post, userId, isUserPost = false } = props

  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const setIsPostOpen = usePostStore((store) => store.setIsPostOpen)
  const setSelectedPostId = usePostStore((store) => store.setSelectedPostId)
  const setSelectedPost = usePostStore((store) => store.setSelectedPost)
  const setIsEditing = usePostStore((store) => store.setIsEditing)
  const isFollowing = post.isFollowing

  const { deletePostMutation } = useUpdateDeleteMutation(userId)
  const { likePostMutation, unlikePostMutation } = useLikePostMutation({
    postId: post.id,
    userId: userId,
    content: post.content,
  })

  const handleUpdatePost = () => {
    setIsPostOpen(true)
    setSelectedPostId(post.id)
    setSelectedPost({
      id: post.id,
      content: post.content,
      selectedFile: post.selectedFile,
    })
    setIsEditing(true)
  }

  const handleLikePost = (isLiked: boolean) => {
    return !isLiked ? likePostMutation.mutate() : unlikePostMutation.mutate()
  }

  const { followMutation, unFollowMutation } = useFolloMutation({
    userIdToFollow: post.user.id,
  })

  const handleFollowUser = () => {
    isFollowing ? unFollowMutation.mutate() : followMutation.mutate()
  }

  return (
    <>
      <div className="flex gap-3 p-3">
        <Link
          href={`/profile/${post.user.id}`}
          className={cn(
            "focus-visible:outline-offset-3 rounded-full ring-primary ring-offset-1 focus-visible:outline-primary focus-visible:ring-primary active:ring"
          )}
        >
          <Avatar>
            <AvatarImage
              src={post.user.image ?? "/default-image.png"}
              alt={post.user.name ?? ""}
            />
            <AvatarFallback>
              <div className="size-full animate-pulse"></div>
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="mr-auto flex flex-col self-center leading-none">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${post.user.id}`}
              className={cn(
                "block font-medium capitalize text-foreground/90 underline-offset-1 hover:underline"
              )}
            >
              {post.user.name}
            </Link>
            {!isUserPost && (
              <>
                <div className="size-1 rounded-full bg-foreground/50"></div>
                <button
                  onClick={handleFollowUser}
                  className={cn(
                    "text-sm font-semibold underline-offset-1 hover:underline",
                    isFollowing ? "text-foreground/60" : "text-primary"
                  )}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </>
            )}
          </div>

          <span className="text-xs text-muted-foreground/70">
            {dayjs(post.createdAt).fromNow(true)}
          </span>
        </div>
        {isUserPost && (
          <div className="self-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className={cn(
                    "rounded-full p-2 text-foreground/80 hover:text-foreground/90 active:scale-110"
                  )}
                  aria-label="open modal post"
                >
                  <BiDotsHorizontalRounded aria-hidden="true" size={26} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full cursor-pointer"
                    onClick={handleUpdatePost}
                  >
                    Edit
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button
                    onClick={() =>
                      deletePostMutation.mutate({
                        postId: post.id,
                      })
                    }
                    variant="ghost"
                    className="w-full cursor-pointer"
                  >
                    Delete
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button variant="ghost" className="w-full cursor-pointer">
                    Bookmark
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="px-3 font-normal md:px-5">
        <span className="break-words text-base">{post.content}</span>
        {post.selectedFile.length !== 0 && (
          <div
            className={cn(
              "relative grid gap-1",
              post.selectedFile.length > 1 && "!grid-cols-2"
            )}
          >
            {post.selectedFile.map((image, index) => {
              const widthRatio = getImageWidthRatio(
                post.selectedFile.length,
                index
              )
              const heightRatio = getImageHeightRatio(
                post.selectedFile.length,
                index
              )

              return (
                <div
                  key={image.url}
                  className={cn(
                    "relative cursor-pointer overflow-hidden rounded",
                    post.selectedFile.length === 3 &&
                      index === 0 &&
                      "col-span-2",
                    post.selectedFile.length === 3 && index === 2 && "self-end"
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
          <span className="flex size-6 items-center justify-center rounded-full bg-primary">
            <BiSolidLike
              aria-hidden
              size={14}
              className="text-primary-foreground"
            />
          </span>

          <span className="font-medium text-foreground/80">
            {post._count.likePost}
          </span>
        </div>
        <div className="flex gap-1 text-sm font-semibold text-muted-foreground/80">
          <span>{post._count.comment}</span>
          <VscCommentDiscussion aria-hidden size={20} />
        </div>
      </div>
      <ul className="rou mx-1 mt-1 flex justify-between rounded-t-md border-t border-l-secondary/40 font-light">
        <li className="w-full flex-1 py-1">
          <Button
            type="button"
            className={cn(
              "text-muted-foreground-600 flex h-[35px] w-full items-center justify-center gap-1 rounded-md hover:bg-secondary active:scale-110",
              "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
            )}
            variant="ghost"
            aria-label="Like Post"
            onClick={() => handleLikePost(post.isLiked)}
          >
            {post.isLiked ? (
              <span>
                <AiFillLike
                  aria-hidden="true"
                  size={21}
                  className="text-primary"
                />
              </span>
            ) : (
              <span>
                <AiOutlineLike
                  aria-hidden="true"
                  size={21}
                  className="text-foreground"
                />
              </span>
            )}

            <span
              className={cn(
                "text-sm",
                post.isLiked
                  ? "font-bold text-primary"
                  : "font-medium text-foreground"
              )}
            >
              Like
            </span>
          </Button>
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
            <VscCommentDiscussion
              aria-hidden="true"
              size={20}
              className="text-foreground/90"
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
      {isCommentOpen && <Comments postId={post.id} />}
    </>
  )
}

export default React.memo(PostItem)
