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
import { motion, AnimatePresence } from "framer-motion"

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

    const { setIsUpdating, setIsPostOpen, setSelectedPost } = usePostStore()

    const handleOnAlertOpen = React.useCallback(() => {
      setIsAlertOpen(true)
    }, [])

    const handleOnAction = React.useCallback(() => {
      setIsPostOpen(true)
      setIsUpdating(true)
      setSelectedPost({
        postId: post.id,
        content: post.content,
        selectedFile: post.selectedFile,
      })
    }, [post, setIsPostOpen, setIsUpdating, setSelectedPost])

    const { deletePostMutation } = useDeletePost(userId)

    const handleDeletePost = React.useCallback(() => {
      deletePostMutation.mutate({ postId: post.id })
    }, [deletePostMutation, post.id])

    const handleOpenComment = React.useCallback(() => {
      setIsCommentOpen(true)
    }, [])

    // ImageGrid component for post images with animation and hover effect
    const ImageGrid = React.memo(
      ({ images }: { images: { url: string }[] }) => (
        <div
          className={cn(
            "relative grid gap-1",
            images.length > 1 && "!grid-cols-2"
          )}
        >
          <AnimatePresence initial={false}>
            {images.map((image, index) => (
              <motion.div
                key={image.url}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded",
                  images.length === 3 && index === 0 && "col-span-2",
                  images.length === 3 && index === 2 && "self-end"
                )}
              >
                <motion.div
                  className="relative h-full cursor-pointer active:opacity-80"
                  tabIndex={0}
                  role="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="h-60 w-full md:h-96">
                    <Image
                      src={image.url}
                      style={{ objectFit: "cover" }}
                      alt={image.url}
                      fill
                      unoptimized
                      className="opacity-0 transition-opacity duration-300 group-hover:opacity-90"
                      onLoadingComplete={(img) =>
                        img.classList.remove("opacity-0")
                      }
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )
    )
    ImageGrid.displayName = "ImageGrid"

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
              <AvatarImage
                src={post.user.image ?? "/default-image.png"}
                alt={""}
              />
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
            <ImageGrid images={post.selectedFile} />
          )}
        </div>

        <div className="mt-2 flex items-center justify-between px-5">
          <div className="flex gap-1 text-sm font-semibold text-muted-foreground/80">
            <span>{post._count.comment}</span>
            <MessageCircle aria-hidden size={20} />
          </div>
        </div>
        <ul className="rou mx-1 mt-1 flex justify-between rounded-t-md border-t border-l-secondary/40 font-light">
          <li className="w-full flex-1 py-1">
            <LikePost
              isLiked={post.isLiked}
              content={post.content}
              likeCounts={post._count.likePost}
              postId={post.id}
            />
          </li>

          <li className="w-full flex-1 py-1">
            <Button
              onClick={handleOpenComment}
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
          onHandleDelete={handleDeletePost}
          description="This action cannot be undone. This will permanently delete your post\n            and remove your data from our servers."
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
