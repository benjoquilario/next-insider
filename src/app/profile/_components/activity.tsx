"use client"

import React, { useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IoPersonOutline } from "react-icons/io5"
import { BsReplyAll } from "react-icons/bs"
import { FaRegComment } from "react-icons/fa6"
import { SlLike } from "react-icons/sl"
import { Activitytype, User } from "@prisma/client"
import { motion } from "framer-motion"
import { IActivity } from "@/types"
import { InView } from "react-intersection-observer"
import { useUser } from "@/lib/auth"

type ActivityUserProps = {
  userId: string
}

const ActivityUser = (props: ActivityUserProps) => {
  const { userId } = props

  const queryKey = useMemo(() => ["activity", userId], [userId])

  const {
    data: activies,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) =>
      fetch(`/api/activity/${userId}?limit=${10}&cursor=${pageParam}`).then(
        (res) => res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="mb-2 mt-4">
      <ul className="space-y-3">
        {isPending
          ? Array.from(Array(4), (_, i) => (
              <li
                key={`activity-${i}`}
                className="flex w-full animate-pulse items-center gap-2 px-2"
              >
                <div className="size-14 rounded-full bg-primary/10"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-56 rounded-md bg-primary/10"></div>
                  <div className="h-4 w-28 rounded-md bg-primary/10"></div>
                </div>
              </li>
            ))
          : activies?.pages.map((page) =>
              page?.activities.length !== 0 ? (
                page?.activities.map((activity: IActivity<User>) => (
                  <motion.li
                    key={activity.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-3xl bg-secondary p-2"
                  >
                    <Activity userId={userId} activity={activity} />
                  </motion.li>
                ))
              ) : (
                <li
                  key={`no-activity`}
                  className="mt-4 flex items-center justify-center text-center text-2xl font-medium"
                >
                  No activity!
                </li>
              )
            )}
        <InView
          fallbackInView
          onChange={async (InView) => {
            if (InView && hasNextPage && !isFetchingNextPage) {
              await fetchNextPage()
            }
          }}
        >
          {({ ref }) => (
            <li ref={ref} className="mt-4 w-full">
              {isFetchingNextPage &&
                Array.from(Array(4), (_, i) => (
                  <li
                    key={`activity-skeleton-${i}`}
                    className="flex w-full animate-pulse items-center gap-2 px-2"
                  >
                    <div className="size-14 rounded-full bg-secondary"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-6 w-56 rounded-md bg-secondary"></div>
                      <div className="h-4 w-28 rounded-md bg-secondary"></div>
                    </div>
                  </li>
                ))}
            </li>
          )}
        </InView>
      </ul>
    </div>
  )
}

type ActivityProps = {
  activity: IActivity<User>
  userId: string
}

const Activity = (props: ActivityProps) => {
  const { activity } = props
  const { session: user } = useUser()

  const currentUser = activity.sourceUser.id === user?.id
  const isTargetUser = activity.targetUser.id === user?.id

  console.log(currentUser)

  console.log(activity)

  if (activity.type === "FOLLOW_USER") {
    return (
      <ActivityCard activity={activity}>
        <p>
          {currentUser && "You"} started following {activity.targetUser.name}
        </p>
      </ActivityCard>
    )
  }

  if (activity.type === "POST_LIKE") {
    return (
      <ActivityCard activity={activity}>
        <div className="flex flex-col items-start gap-1">
          <p className="text-sm md:text-base">
            <span className="font-semibold capitalize">
              {currentUser ? "You" : activity.sourceUser.name}{" "}
            </span>
            liked{" "}
            <span className="font-semibold capitalize">
              {isTargetUser ? "your" : activity.targetUser.name}{" "}
            </span>
            post:
          </p>
          <p
            style={{ overflowWrap: "anywhere" }}
            className="text-muted=foreground/80 text-sm md:text-base"
          >
            {activity.content}
          </p>
        </div>
      </ActivityCard>
    )
  }

  if (activity.type === "COMMENT_LIKE") {
    return (
      <ActivityCard activity={activity}>
        <div className="flex flex-col items-start gap-1">
          <p className="text-sm md:text-base">
            <span className="font-semibold capitalize">
              {currentUser ? "You" : activity.sourceUser.name}{" "}
            </span>
            liked{" "}
            <span className="capitalize">
              {currentUser ? "your" : activity.targetUser.name}{" "}
            </span>
            comment:
          </p>
          <p
            style={{ overflowWrap: "anywhere" }}
            className="text-muted=foreground/80 text-sm md:text-base"
          >
            {activity.content}
          </p>
        </div>
      </ActivityCard>
    )
  }

  if (activity.type === "REPLY_LIKE") {
    return (
      <ActivityCard activity={activity}>
        <div className="flex flex-col items-start gap-1">
          <p className="text-sm md:text-base">
            <span className="font-semibold capitalize">
              {currentUser ? "You" : activity.sourceUser.name}{" "}
            </span>
            liked{" "}
            <span className="capitalize">
              {currentUser ? "your" : activity.targetUser.name}{" "}
            </span>
            reply
          </p>
          <p
            style={{ overflowWrap: "anywhere" }}
            className="text-muted=foreground/80 text-sm md:text-base"
          >
            {activity.content}
          </p>
        </div>
      </ActivityCard>
    )
  }
}

const FollowUserIcon = () => (
  <div className="absolute -bottom-2 right-0 rounded-full bg-primary p-1 text-sm text-white">
    <IoPersonOutline />
  </div>
)
const LikeIcon = () => (
  <div className="absolute -bottom-2 right-0 rounded-full bg-primary p-1 text-sm text-white">
    <SlLike />
  </div>
)

const CommentLikeIcon = () => (
  <div className="absolute -bottom-2 right-0 rounded-full bg-primary p-1 text-sm text-white">
    <FaRegComment />
  </div>
)
const ReplyLikeIcon = () => (
  <div className="absolute -bottom-2 right-0 rounded-full bg-primary p-1 text-sm text-white">
    <BsReplyAll />
  </div>
)

const ActivityIcons = {
  FOLLOW_USER: () => <FollowUserIcon />,
  POST_LIKE: () => <LikeIcon />,
  COMMENT_LIKE: () => <CommentLikeIcon />,
  REPLY_LIKE: () => <ReplyLikeIcon />,
}

const ActivityIcon = ({ type }: { type: Activitytype }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  return <>{ActivityIcons[type]()}</>
}

type ActivityCardProps = {
  activity: IActivity<User>
  children: React.ReactNode
}

const ActivityCard = (props: ActivityCardProps) => {
  const { activity, children } = props

  return (
    <div className="flex gap-2">
      <div className="relative">
        <div className="relative">
          <Avatar className="size-12">
            <AvatarImage
              className="size-12"
              src={activity.targetUser.image ?? "/default-image.png"}
              alt={activity.targetUser.name ?? ""}
            />
            <AvatarFallback>
              <div className="size-full animate-pulse"></div>
            </AvatarFallback>
          </Avatar>
          <ActivityIcon type={activity.type} />
        </div>
      </div>
      <div>
        {children}
        <span className="text-sm text-muted-foreground/80">4hours ago</span>
      </div>
    </div>
  )
}

export default ActivityUser
