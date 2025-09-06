"use client"

import { Button } from "@/components/ui/button"
import { unFollow, follow } from "@/server/follow"
import * as React from "react"

const FollowButton = ({
  isUserFollowing,
  userIdToFollow,
}: {
  isUserFollowing: boolean
  userIdToFollow: string
}) => {
  const [isFollowing, setIsFollowing] = React.useState(isUserFollowing)

  return (
    <Button
      onClick={async () => {
        if (isFollowing) {
          setIsFollowing(false)
          await unFollow({ userIdToFollow })
        } else {
          setIsFollowing(true)
          await follow({ userIdToFollow })
        }
      }}
      variant={isFollowing ? "default" : "secondary"}
      className="flex items-center gap-1 rounded-full"
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
}
export default FollowButton
