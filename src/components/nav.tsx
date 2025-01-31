"use client"

import { SquareStack, UserRoundSearch, User, BellRing } from "lucide-react"
import usePostStore from "@/store/post"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"

const Nav = () => {
  const { session } = useUser()
  const setIsPostOpen = usePostStore((store) => store.setIsPostOpen)

  const className = cn(
    "flex w-full items-center space-x-3 rounded-md px-5 py-3 focus:outline-none",
    "focus-visible:outline-offset-2 focus-visible:outline-primary",
    "transition duration-75 hover:bg-primary/40"
  )

  return (
    <div className="mt-0">
      <nav className="w-full">
        <ul className="flex flex-col items-start space-y-2">
          <li className="flex flex-1 items-start">
            <Link href="/" className={className}>
              <SquareStack aria-hidden="true" className="size-6 text-primary" />
              <span className="text-left text-base font-medium capitalize tracking-tight">
                Feed
              </span>
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
              <span className="text-left text-base font-medium capitalize tracking-tight">
                Discover
              </span>
            </Link>
          </li>
          <li className="flex flex-1 items-start">
            <Link aria-label="feed" href={`/nofications`} className={className}>
              <BellRing aria-hidden="true" className="size-6 text-primary" />
              <span className="text-left text-base font-medium capitalize tracking-tight">
                Notification
              </span>
            </Link>
          </li>

          <li className="flex flex-1 items-start">
            <Link
              aria-label="my profile"
              href={`/profile/${session?.id}`}
              className={cn(
                "flex w-full items-center space-x-3 rounded-md px-5 py-3 focus:outline-none",
                "focus-visible:outline-offset-2 focus-visible:outline-primary",
                "transition duration-75 hover:bg-primary/40"
              )}
            >
              <User className="size-6 text-primary" />
              <span className="text-left text-base font-medium capitalize tracking-tight">
                My Profile
              </span>
            </Link>
          </li>
          <li className="mt-3 w-full flex-1">
            <div className="flex w-full items-center">
              <Button
                onClick={() => setIsPostOpen(true)}
                className="h-11 w-full rounded-3xl"
                size="lg"
              >
                Create Post
              </Button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav
