"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import usePostStore from "@/store/post"
import CreatePost from "./create-post"
import { useQueryUser } from "@/hooks/queries/useQueryUser"

type CreateButtonProps = {
  userId?: string
}

const CreateButton = (props: CreateButtonProps) => {
  const { userId } = props
  const setIsPostOpen = usePostStore((store) => store.setIsPostOpen)
  const { data: currentUser, isPending } = useQueryUser()

  return (
    <React.Fragment>
      <div className="relative my-2 flex h-20 items-center justify-start gap-2 overflow-hidden rounded p-2 shadow">
        <div className="min-h-6 w-12 max-w-20">
          {isPending ? (
            <div className="h-10 w-10 rounded-full bg-primary/10"></div>
          ) : (
            <Link
              href={`/`}
              className="rounded-full ring-primary ring-offset-1 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary active:ring"
            >
              <Avatar>
                <AvatarImage
                  src={currentUser?.image ?? "/default-image.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>
                  <div className="h-full w-full animate-pulse bg-primary/10"></div>
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
        <Button
          onClick={() => setIsPostOpen(true)}
          variant="secondary"
          disabled={isPending}
          aria-label="create a post"
          className="w-full justify-start rounded-full"
          size="lg"
        >
          <span className="ml-2 text-xs md:text-sm">
            What&apos;s on your mind, {currentUser?.name?.split(" ")[0]}
          </span>
        </Button>
      </div>
      <CreatePost userId={userId} />
    </React.Fragment>
  )
}

export default CreateButton
