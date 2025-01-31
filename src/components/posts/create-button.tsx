"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import usePostStore from "@/store/post"
import CreatePost from "./create-post"
import { useUser } from "@/lib/auth"

const CreateButton = ({ userId }: { userId?: string }) => {
  const { session: user } = useUser()
  const setIsPostOpen = usePostStore((state) => state.setIsPostOpen)
  const isPostOpen = usePostStore((state) => state.isPostOpen)
  const selectedPost = usePostStore((state) => state.selectedPost)

  const openPostModal = () => {
    setIsPostOpen(true)
  }

  return (
    <React.Fragment>
      <div className="relative my-2 flex h-20 w-full items-center justify-start gap-2 overflow-hidden rounded border p-2 shadow">
        <div className="min-h-6 w-12 max-w-20">
          <Link
            href={`/profile/${user?.id}`}
            className="rounded-full ring-primary ring-offset-1 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary active:ring"
          >
            <Avatar>
              <AvatarImage
                src={user?.image ?? "/default-image.png"}
                alt="@shadcn"
              />
              <AvatarFallback>
                <div className="size-full animate-pulse bg-primary/10"></div>
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <Button
          onClick={openPostModal}
          variant="secondary"
          // disabled={isPending}
          aria-label="create a post"
          className="w-full justify-start rounded-full"
          size="lg"
        >
          <span className="ml-2 text-xs md:text-sm">
            What&apos;s on your mind, {}
          </span>
        </Button>
      </div>
      {isPostOpen && (
        <CreatePost
          content={selectedPost.content}
          selectedFile={selectedPost.selectedFile}
          userId={userId}
        />
      )}
    </React.Fragment>
  )
}

export default CreateButton
