"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import usePostStore from "@/store/post"
import CreatePost from "./create-post"
import { useUser } from "@/lib/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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
      <Card className="mb-3 h-20 w-full">
        <CardHeader className="sr-only">
          <span className="sr-only">Create a new post</span>
        </CardHeader>
        <CardContent className="h-full w-full pb-0">
          <div className="flex h-full items-center justify-between">
            <div className="min-h-6 w-12 max-w-20">
              <Link
                href={`/profile/${user?.id}`}
                className="ring-primary focus-visible:outline-primary focus-visible:ring-primary rounded-full ring-offset-1 focus-visible:outline-offset-2 active:ring"
              >
                <Avatar>
                  <AvatarImage
                    src={user?.image ?? "/default-image.png"}
                    alt={user?.name || "User Avatar"}
                  />
                  <AvatarFallback>
                    <div className="bg-accent size-full animate-pulse"></div>
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <Button
              onClick={openPostModal}
              variant="secondary"
              // disabled={isPending}
              aria-label="create a post"
              className="w-full cursor-pointer justify-start rounded-full"
              size="lg"
            >
              <span className="ml-2 text-xs md:text-sm">
                What&apos;s on your mind, {user?.name || "User"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

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
