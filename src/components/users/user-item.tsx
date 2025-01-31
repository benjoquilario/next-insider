"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BsFillPersonPlusFill } from "react-icons/bs"
import { IUsers } from "."

type UserItemProps = {
  user: IUsers
}

const UserItem = (props: UserItemProps) => {
  const { user } = props

  return (
    <li className="relative rounded-md hover:bg-secondary">
      <Link
        href={`/profile/${user.id}`}
        className="transition duration-75 hover:bg-secondary"
      >
        <div className="flex items-center rounded-md border border-secondary py-2">
          <div className="ml-3">
            <Avatar>
              <AvatarImage src={user.image ?? ""} alt="" />
              <AvatarFallback>
                <div className="size-full animate-pulse bg-primary/10" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-4 flex-1 text-foreground">
            <h3 className="text-sm font-semibold capitalize leading-tight">
              {user.name}
            </h3>
            <p className="text-xs">{user._count.followers} Followers</p>
          </div>
        </div>
      </Link>
      <div className="absolute right-0 top-4">
        <button
          aria-label="follow user"
          className={cn(
            "ml-auto mr-3 flex size-8 items-center justify-center rounded-md"
          )}
        >
          <BsFillPersonPlusFill aria-hidden="true" size={15} />
        </button>
      </div>
    </li>
  )
}

export default UserItem
