"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { BsPerson } from "react-icons/bs"
import SignOut from "./sign-out"
import { IoCreateOutline } from "react-icons/io5"
import usePostStore from "@/store/post"
import { useUser } from "@/lib/auth"
import { SquareStack, UserRoundSearch, BellRing } from "lucide-react"

const MobileNav = () => {
  const { session } = useUser()
  const setIsPostOpen = usePostStore((store) => store.setIsPostOpen)

  const className = cn(
    "flex w-full items-center justify-center rounded-md p-2 focus:outline-none",
    "focus-visible:outline-offset-2 focus-visible:outline-primary",
    "transition duration-75 hover:bg-primary/40"
  )

  return (
    <div className="fixed bottom-0 z-50 flex w-full bg-background md:hidden">
      <nav className="w-full" aria-label="mobile nav">
        <ul className="mt-1 flex items-start">
          <li className="flex flex-1 items-start">
            <Link href="/" className={className}>
              <SquareStack aria-hidden="true" className="size-6 text-primary" />
            </Link>
          </li>
          <li className="flex flex-1 items-start">
            <Link
              aria-label="feed"
              href={`/discover`}
              className={cn(className)}
            >
              <UserRoundSearch
                aria-hidden="true"
                className="size-6 text-primary"
              />
            </Link>
          </li>
          <li className="flex flex-1 items-start">
            <Link aria-label="feed" href={`/nofications`} className={className}>
              <BellRing aria-hidden="true" className="size-6 text-primary" />
            </Link>
          </li>
          <li className="flex flex-1 items-start">
            <Link
              aria-label="my profile"
              href={`/profile/${session?.id}`}
              className={cn(
                "flex w-full items-center justify-center rounded-md p-2 focus:outline-none",
                "focus-visible:outline-offset-2 focus-visible:outline-primary",
                "transition duration-75 hover:bg-primary/40"
              )}
            >
              <BsPerson size={29} className="text-primary" />
            </Link>
          </li>
          <li className="flex flex-1 items-start">
            <SignOut />
          </li>
          {/* <li className="mt-3 w-full flex-1">
            <div className="flex w-full items-center">
              <Button
                onClick={() => setIsPostOpen(true)}
                className="h-11 w-full rounded-3xl"
                size="lg"
              >
                Create Post
              </Button>
            </div>
          </li> */}
        </ul>
      </nav>

      <button
        onClick={() => setIsPostOpen(true)}
        className="absolute bottom-16 right-3 flex size-14 items-center justify-center rounded-full bg-primary text-white"
      >
        <IoCreateOutline size={20} className="size-7" />
      </button>
    </div>
  )
}

export default MobileNav
