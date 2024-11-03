"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegCircle } from "react-icons/fa"
import React from "react"
import Nav from "./nav"
import { SignOut } from "./sign-out"
import { useQueryUser } from "@/hooks/queries/use-query-user"
import { type User } from "@prisma/client"
import { useSession } from "next-auth/react"

const SideBar = () => {
  const { data: currentUser, isPending } = useQueryUser()

  return (
    <div className="sticky top-0">
      <Link
        href={`/profile/${currentUser?.id}`}
        className="focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
      >
        <div className="flex h-14 w-full items-center justify-start gap-2 px-5 text-2xl font-light">
          <span className="text-primary">
            <FaRegCircle />
          </span>
          <span className="text-3xl font-bold uppercase text-primary">
            Insider
          </span>
        </div>
      </Link>
      <div className="rounded px-4 py-5">
        <div className="flex justify-start">
          {isPending ? (
            <div className="flex animate-pulse items-center gap-1">
              <div className="size-10 rounded-full bg-primary/10"></div>
              <div className="flex flex-col gap-1">
                <div className="h-4 w-32 rounded bg-primary/10"></div>
                <div className="h-4 w-14 rounded bg-primary/10"></div>
              </div>
            </div>
          ) : (
            <Link
              href={`/profile/${currentUser?.id}`}
              className="flex items-center gap-1"
            >
              <div>
                <Avatar>
                  <AvatarImage
                    src={currentUser?.image ?? "/default-image.png"}
                    alt={currentUser?.name ?? ""}
                  />
                  <AvatarFallback>
                    <div className="size-full animate-pulse"></div>
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium capitalize">{currentUser?.name}</h3>
                <span className="text-xs text-muted-foreground/60">
                  {currentUser?._count.followers} Followers
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
      <Nav currentUser={currentUser as User} />
      <div className="mt-28">
        <SignOut />
      </div>
    </div>
  )
}

export default SideBar
