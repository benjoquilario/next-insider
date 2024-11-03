"use client"

import React, { use } from "react"
import { cn } from "@/lib/utils"
import ProfilePhoto from "@/components/profile/profile-photo"
import CoverPhoto from "@/components/profile/cover-photo"
import ProfileSkeleton from "@/components/skeleton/profile-skeleton"
import TabsProfile from "@/components/profile/tabs"
import { useQueryUserById } from "@/hooks/queries/use-query-user-id"
import { useSession } from "next-auth/react"
import { Button, buttonVariants } from "@/components/ui/button"
import type { User } from "@prisma/client"
import Link from "next/link"
import { useFolloMutation } from "@/hooks/useFollowMutation"

const ProfilePage = (props: { params: Promise<{ userId: string }> }) => {
  const params = use(props.params)
  const userId = params.userId
  const { data: session } = useSession()

  const { data: user, isPending } = useQueryUserById(userId)

  const isFollowing = user?.isFollowing

  const { followMutation, unFollowMutation } = useFolloMutation({
    userIdToFollow: userId,
  })

  const handleFollowUser = () => {
    isFollowing ? unFollowMutation.mutate() : followMutation.mutate()
  }

  const isCurrentUser = userId === session?.user.id

  return (
    <div className="col-span-full lg:col-span-9 xl:col-span-6">
      {/*  */}
      {isPending ? (
        <ProfileSkeleton />
      ) : (
        <div className="mb-2 mt-0">
          <CoverPhoto userId={userId} photoUrl={user?.cover!} />
          <div className="space-y-4">
            <div className="flex flex-col justify-center shadow md:flex-row md:justify-between">
              <div className="flex flex-col items-center justify-center gap-3 px-5 py-2 md:flex-row md:pb-5">
                <ProfilePhoto userId={userId} photoUrl={user?.image!} />
                <div className="text-center sm:text-left">
                  <div>
                    <h1 className="text-lg font-semibold capitalize text-foreground">
                      {user?.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profile/${userId}/followers`}
                        className="text-sm text-muted-foreground/90 underline-offset-1 hover:underline"
                      >
                        <span className="mr-1 font-semibold">
                          {user?.followerCount}
                        </span>
                        Followers
                      </Link>
                      <Link
                        href={`/profile/${userId}/following`}
                        className="text-sm text-muted-foreground/90 underline-offset-1 hover:underline"
                      >
                        <span className="mr-1 font-semibold">
                          {user?.followingCount}
                        </span>
                        Following
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-center p-3">
                {!isCurrentUser ? (
                  <Button
                    onClick={handleFollowUser}
                    variant={isFollowing ? "default" : "secondary"}
                    className="flex items-center gap-1 rounded-full"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                ) : (
                  <Link
                    href="/edit-profile"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Edit Profile
                  </Link>
                )}

                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      )}
      {user?.bio ? (
        <div className="my-2 flex w-full items-center justify-center rounded-sm p-3 text-center shadow">
          <p className="max-w-80 text-sm italic text-muted-foreground">
            {user.bio}
          </p>
        </div>
      ) : null}

      <TabsProfile
        isUserPost={isCurrentUser}
        user={user as User}
        userId={userId}
      />
    </div>
  )
}

export default ProfilePage
