"use client"

import type { User } from "@/generated/prisma"
import * as React from "react"
import UserItem from "./user-item"
import { ScrollArea } from "../ui/scroll-area"

export interface IUsers extends User {
  _count: {
    followers: number
  }
}

const Users = ({ usersPromise }: { usersPromise: Promise<IUsers[]> }) => {
  const users = React.use(usersPromise)

  console.log(users)

  return (
    <div className="sticky top-0 pt-3">
      <div className="relative flex items-center justify-end gap-2">
        <div className="flex items-center justify-end">
          <div className="flex items-center justify-center gap-1">
            {/* )}
            {isOpen && <Dropdown />} */}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <aside className="overflow-hidden rounded-md border shadow">
          <h2 className="px-5 py-3 text-sm font-semibold">Trends this week</h2>
          <a className="block" href="/tag/trpc">
            <div className="hover:bg-secondary cursor-pointer px-5 py-3">
              <p className="mb-2 text-sm font-semibold">#nextjs</p>
              <p className="text-muted-foreground/80 text-xs font-medium">
                10 posts
              </p>
            </div>
          </a>
          <a className="block" href="/tag/trpc">
            <div className="hover:bg-secondary cursor-pointer px-5 py-3">
              <p className="mb-2 text-sm font-semibold">#postgrel</p>
              <p className="text-muted-foreground/80 text-xs font-medium">
                4 posts
              </p>
            </div>
          </a>
        </aside>
        <aside className="mt-2">
          <div className="flex w-full flex-col justify-center rounded-xl border py-3">
            <p className="text-md text-foreground/90 text-center font-bold">
              Who to follow
            </p>
            <ScrollArea className="h-fit w-full px-2">
              <ul className="flex max-h-72 flex-col gap-2">
                {users.map((user) => (
                  <UserItem key={user.id} user={user} />
                ))}
              </ul>
            </ScrollArea>
            {/* <ul className="mt-3 max-h-72 w-full space-y-1"></ul> */}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Users
