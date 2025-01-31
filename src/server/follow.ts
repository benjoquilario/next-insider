"use server"

import { getUser } from "@/lib/user"
import db from "@/lib/db"

export const follow = async function ({
  userIdToFollow,
}: {
  userIdToFollow: string
}) {
  const session = await getUser()
  const userId = session?.id

  if (!session) return

  const isFollowExist = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId!,
        followingId: userIdToFollow,
      },
    },
  })

  if (isFollowExist) return

  const follow = await db.follow.create({
    data: {
      followerId: userId!,
      followingId: userIdToFollow,
    },
  })

  if (follow) {
    await db.activity.create({
      data: {
        type: "FOLLOW_USER",
        sourceUserId: userId!,
        targetId: follow.followingId,
        contentId: userIdToFollow,
        content: "",
      },
    })
  }

  return
}

export const unFollow = async function ({
  userIdToFollow,
}: {
  userIdToFollow: string
}) {
  const session = await getUser()
  const userId = session?.id

  if (!session) return

  const isFollowing = await db.follow.count({
    where: {
      followerId: userId!,
      followingId: userIdToFollow,
    },
  })

  if (isFollowing) {
    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId!,
          followingId: userIdToFollow,
        },
      },
    })
  }

  return
}
