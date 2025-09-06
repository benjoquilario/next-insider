"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegCircle } from "react-icons/fa"
import Nav from "@/components/nav"
import React from "react"
import SignOut from "./sign-out"
import { useUser } from "@/lib/auth"

const SideBar = () => {
  const { session: user } = useUser()

  return (
    <div className="sticky top-0">
      <Link
        href={`/profile/${user?.id}`}
        className="focus-visible:outline-primary focus-visible:ring-primary focus-visible:outline-offset-2"
      >
        <div className="flex h-14 w-full items-center justify-start gap-2 px-5 text-2xl font-light">
          <span className="text-primary">
            <FaRegCircle />
          </span>
          <span className="text-primary text-3xl font-bold uppercase">
            Insider
          </span>
        </div>
      </Link>
      <div className="rounded px-4 py-5">
        <div className="flex justify-start">
          <Link
            href={`/profile/${user?.id}`}
            className="flex items-center gap-1"
          >
            <div>
              <Avatar>
                <AvatarImage
                  src={user?.image ?? "/default-image.png"}
                  alt={user?.name ?? "User"}
                />
                <AvatarFallback>
                  <div className="bg-accent size-full animate-pulse"></div>
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium capitalize">{user?.name}</h3>
            </div>
          </Link>
        </div>
      </div>
      <Nav />
      <div className="mt-28">
        <SignOut />
      </div>
    </div>
  )
}

export default SideBar
