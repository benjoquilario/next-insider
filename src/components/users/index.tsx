"use client"

import type { User } from "@/generated/prisma"
import * as React from "react"
import UserItem from "./user-item"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent, CardHeader } from "../ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { FileWarning } from "lucide-react"
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
      <div className="relative flex items-center justify-start gap-2">
        <div className="flex items-center justify-end">
          <div className="flex items-start justify-start gap-1">
            {/* )}
            {isOpen && <Dropdown />} */}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-xs">
                  <FileWarning className="text-destructive mr-1" /> Note from
                  the developer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Note from the developer</DialogTitle>
                  <DialogDescription className="text-foreground/70 mt-4 text-sm leading-7">
                    <span className="font-semibold">Please read this:</span>
                    <br />
                    Hi! I'm BenJo Quilario, the developer of this application.
                    This is a simple app, so I kindly ask that you avoid DDoS
                    attacks or spamming—I would greatly appreciate it. There’s
                    nothing to gain from attacking this app; if you’re looking
                    for a challenge, there are bigger fish to fry out there.
                    <br />
                    <br />
                    Thank you for your understanding and support!
                    <br />
                    <span className="mt-2 block text-xs font-semibold">
                      – BenJo Quilario
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Card className="p-2">
          <CardHeader className="p-0">
            <h2 className="text-md py-3 font-semibold">Trends this week</h2>
          </CardHeader>
          <CardContent className="p-0">
            <a className="block" href="/tag/trpc">
              <div className="hover:bg-secondary cursor-pointer px-2 py-3">
                <p className="mb-2 text-sm font-semibold">#nextjs</p>
                <p className="text-muted-foreground/80 text-xs font-medium">
                  10 posts
                </p>
              </div>
            </a>
            <a className="block" href="/tag/trpc">
              <div className="hover:bg-secondary cursor-pointer px-2 py-3">
                <p className="mb-2 text-sm font-semibold">#postgrel</p>
                <p className="text-muted-foreground/80 text-xs font-medium">
                  4 posts
                </p>
              </div>
            </a>
          </CardContent>
        </Card>
        <aside className="mt-2">
          <Card className="pb-0">
            <CardHeader className="py-2">
              <p className="text-md text-foreground/90 text-center font-semibold">
                Who to follow
              </p>
            </CardHeader>
            <CardContent className="p-0 pb-2">
              <ScrollArea className="h-fit w-full px-2">
                <ul className="flex max-h-72 flex-col gap-2">
                  {users.map((user) => (
                    <UserItem key={user.id} user={user} />
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>

            {/* <ul className="mt-3 max-h-72 w-full space-y-1"></ul> */}
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default Users
