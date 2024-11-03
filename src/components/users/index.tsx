"use client"

import React, { useState } from "react"
import { IoMdArrowDropdown } from "react-icons/io"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import UserItem from "./user-item"
import { cn } from "@/lib/utils"
import { useQueryUser } from "@/hooks/queries/use-query-user"
import { useInfiniteQuery } from "@tanstack/react-query"
import { User } from "@prisma/client"

const Users = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: currentUser, isPending } = useQueryUser()

  const toggleDropDown = () => {
    setIsOpen(!isOpen)
  }

  const [pageNumber, setPageNumber] = useState(1)

  const {
    data: users,
    isPending: isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", pageNumber],
    queryFn: ({ pageParam }) =>
      fetch(`/api/users?limit=${3}&cursor=${pageParam}`).then((res) =>
        res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="sticky top-0 pt-3">
      <div className="relative flex items-center justify-end gap-2">
        <div className="flex items-center justify-end">
          <div className="flex items-center justify-center gap-1">
            {/* {isLoading ? (
              <div className="h-12 w-12 animate-pulse rounded-full border border-zinc-200 bg-zinc-100" />
            ) : ( */}

            {isPending ? (
              <div className="flex h-14 w-20 items-center justify-center rounded-full bg-secondary px-1">
                <div className="size-5 bg-secondary"></div>
                <div className="size-10 animate-pulse rounded-full bg-primary/10"></div>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={toggleDropDown}
                className="w-18 flex h-14 items-center justify-center rounded-full hover:opacity-90 active:scale-95"
                aria-label="dropdown profile"
              >
                <div
                  className={cn(
                    "transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                >
                  <IoMdArrowDropdown aria-hidden="true" size={20} />
                </div>

                <Avatar>
                  <AvatarImage
                    src={currentUser?.image ?? "/default-image.png"}
                    alt={`@${currentUser?.name ?? ""}`}
                  />
                  <AvatarFallback>
                    <div className="size-full animate-pulse rounded-full bg-primary/10"></div>
                  </AvatarFallback>
                </Avatar>
              </Button>
            )}

            {/* )}
            {isOpen && <Dropdown />} */}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <aside className="overflow-hidden rounded-md border shadow">
          <h2 className="px-5 py-3 text-sm font-semibold">Trends this week</h2>
          <a className="block" href="/tag/trpc">
            <div className="cursor-pointer px-5 py-3 hover:bg-secondary">
              <p className="mb-2 text-sm font-semibold">#nextjs</p>
              <p className="text-xs font-medium text-muted-foreground/80">
                10 posts
              </p>
            </div>
          </a>
          <a className="block" href="/tag/trpc">
            <div className="cursor-pointer px-5 py-3 hover:bg-secondary">
              <p className="mb-2 text-sm font-semibold">#postgrel</p>
              <p className="text-xs font-medium text-muted-foreground/80">
                4 posts
              </p>
            </div>
          </a>
        </aside>
        <aside className="mt-2">
          <div className="flex w-full flex-col justify-center rounded-xl border py-3">
            <p className="text-md text-center font-bold text-foreground/90">
              Who to follow
            </p>

            <ul className="mt-3 max-h-72 w-full space-y-1 overflow-y-auto">
              {/* {isUsersLoading
                ? Array.from(Array(4), (_, i) => <UsersSkeleton key={i} />)
                : data?.pages.map((page) =>
                    page.users.map((user) => (
                      <User user={user as UserType} key={user.id} />
                    ))
                  )}
              {hasNextPage && !isFetchingNextPage && (
                <li className="flex items-center justify-center">
                  <Button
                    type="button"
                    onClick={() => fetchNextPage()}
                    className="text-zinc-900"
                  >
                    Load More
                  </Button>
                </li>
              )} */}
              {users?.pages.map((page) =>
                page?.users.map((user: User) => (
                  <UserItem key={page.id} user={user} />
                ))
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Users
