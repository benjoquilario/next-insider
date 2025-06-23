"use client"

import { use } from "react"
import { type UserProfile } from "@/types"
import { notFound } from "next/navigation"
import Link from "next/link"
import FollowButton from "./follow-button"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import CoverPhoto from "./cover-photo"
import ProfilePhoto from "./profile-photo"
import { Card, CardContent } from "@/components/ui/card"
import { Edit } from "lucide-react"

const Profile = ({
  userId,
  profilePromise,
}: {
  userId: string
  profilePromise: Promise<UserProfile>
}) => {
  const profile = use(profilePromise)

  const { isFollowing, isProfileOwner, image, cover } = profile

  return (
    <div className="mt-0 mb-2">
      <Card className="p-0">
        <CardContent className="p-0">
          <CoverPhoto
            isProfileOwner={isProfileOwner}
            cover={cover || "/cover.svg"}
          />
          <div className="space-y-4">
            <div className="flex flex-col justify-center shadow md:flex-row md:justify-between">
              <div className="flex flex-col items-center justify-center gap-3 px-5 py-2 md:flex-row md:pb-5">
                <ProfilePhoto
                  isProfileOwner={isProfileOwner}
                  image={image ?? ""}
                />
                <div className="text-center sm:text-left">
                  <div>
                    <h1 className="text-foreground text-lg font-semibold capitalize">
                      {profile?.name}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      {profile?.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profile/${userId}/followers`}
                        className="text-muted-foreground/90 text-sm underline-offset-1 hover:underline"
                      >
                        <span className="mr-1 font-semibold">
                          {profile?.followerCount}
                        </span>
                        Followers
                      </Link>
                      <Link
                        href={`/profile/${userId}/following`}
                        className="text-muted-foreground/90 text-sm underline-offset-1 hover:underline"
                      >
                        <span className="mr-1 font-semibold">
                          {profile?.followingCount}
                        </span>
                        Following
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-center p-3">
                {!isProfileOwner ? (
                  <FollowButton
                    userIdToFollow={userId}
                    isUserFollowing={isFollowing}
                  />
                ) : (
                  <Link
                    href="/edit-profile"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Link>
                )}

                {/* )} */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default Profile
