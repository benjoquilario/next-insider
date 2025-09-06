"use client"

import React, { useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IoPersonOutline } from "react-icons/io5"
import { BsReplyAll } from "react-icons/bs"
import { FaRegComment } from "react-icons/fa6"
import { SlLike } from "react-icons/sl"
import { Clock, Sparkles } from "lucide-react"
import type { Activitytype, User } from "@/lib/generated/prisma"
import { motion, AnimatePresence } from "framer-motion"
import { IActivity } from "@/types"
import { InView } from "react-intersection-observer"
import { useUser } from "@/lib/auth"
import { cn } from "@/lib/utils"

type ActivityUserProps = {
  userId: string
}

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const activityVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

const shimmerVariants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
}

const ActivityUser = ({ userId }: ActivityUserProps) => {
  const queryKey = useMemo(() => ["activity", userId], [userId])

  const {
    data: activities,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetch(`/api/activity/${userId}?limit=10&cursor=${pageParam}`).then(
        (res) => res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  const allActivities = useMemo(
    () => activities?.pages.flatMap((page) => page?.data || []) || [],
    [activities]
  )

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Sparkles className="text-primary h-6 w-6" />
        <h2 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
          Recent Activity
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {isPending ? (
            <ActivitySkeletons count={5} />
          ) : allActivities.length > 0 ? (
            allActivities.map((activity: IActivity<User>, idx) => (
              <motion.div
                key={activity.id}
                variants={activityVariants}
                layout
                className="transform-gpu"
              >
                <ActivityCard userId={userId} activity={activity} />
              </motion.div>
            ))
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>

        {/* Infinite scroll trigger */}
        <InfiniteScrollTrigger
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </motion.div>
    </div>
  )
}

// Skeleton Components
const ActivitySkeletons = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <motion.div
        key={`skeleton-${i}`}
        variants={activityVariants}
        className="overflow-hidden"
      >
        <Card className="from-muted/50 to-muted/30 border-0 bg-gradient-to-r backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <motion.div
                  variants={shimmerVariants}
                  animate="animate"
                  className="from-muted via-muted-foreground/20 to-muted h-12 w-12 rounded-full bg-gradient-to-r bg-[length:200%_100%]"
                />
                <div className="bg-muted absolute -right-1 -bottom-1 h-6 w-6 rounded-full" />
              </div>
              <div className="flex-1 space-y-3">
                <motion.div
                  variants={shimmerVariants}
                  animate="animate"
                  className="from-muted via-muted-foreground/20 to-muted h-4 w-3/4 rounded bg-gradient-to-r bg-[length:200%_100%]"
                />
                <motion.div
                  variants={shimmerVariants}
                  animate="animate"
                  className="from-muted via-muted-foreground/20 to-muted h-3 w-1/2 rounded bg-gradient-to-r bg-[length:200%_100%]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </>
)

const EmptyState = () => (
  <motion.div
    key="empty-state"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="bg-muted mb-4 rounded-full p-6">
      <Sparkles className="text-muted-foreground h-12 w-12" />
    </div>
    <h3 className="text-muted-foreground text-xl font-semibold">
      No activity yet
    </h3>
    <p className="text-muted-foreground/80 mt-2 text-sm">
      When you start interacting, your activity will appear here
    </p>
  </motion.div>
)

// Infinite Scroll Component
const InfiniteScrollTrigger = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => Promise<any>
}) => (
  <InView
    fallbackInView
    onChange={async (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        await fetchNextPage()
      }
    }}
  >
    {({ ref }) => (
      <div ref={ref} className="mt-8">
        <AnimatePresence>
          {isFetchingNextPage && <ActivitySkeletons count={3} />}
        </AnimatePresence>
      </div>
    )}
  </InView>
)

// Activity Card Component
type ActivityCardProps = {
  activity: IActivity<User>
  userId: string
}

const ActivityCard = ({ activity, userId }: ActivityCardProps) => {
  const { session: user } = useUser()
  const currentUser = activity.sourceUser.id === user?.id
  const isTargetUser = activity.targetUser.id === user?.id

  const activityConfig = getActivityConfig(activity.type)

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group from-background/80 to-muted/30 hover:shadow-primary/5 border-0 bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar with Activity Icon */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Avatar className="ring-background h-12 w-12 shadow-md ring-2">
                  <AvatarImage
                    src={activity.sourceUser.image ?? "/default-image.png"}
                    alt={activity.sourceUser.name ?? ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="from-primary/20 to-primary/10 bg-gradient-to-br">
                    {activity.sourceUser.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                className={cn(
                  "absolute -right-1 -bottom-1 rounded-full p-1.5 text-white shadow-lg",
                  activityConfig.bgColor
                )}
              >
                <activityConfig.icon className="h-3 w-3" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <ActivityContent
                    activity={activity}
                    currentUser={currentUser}
                    isTargetUser={isTargetUser}
                  />
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {activityConfig.label}
                </Badge>
              </div>

              {/* Timestamp */}
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                <span>4 hours ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Activity Content Component
const ActivityContent = ({
  activity,
  currentUser,
  isTargetUser,
}: {
  activity: IActivity<User>
  currentUser: boolean
  isTargetUser: boolean
}) => {
  const getUserName = (user: User, isCurrent: boolean, isTarget: boolean) => {
    if (isCurrent) return "You"
    if (isTarget) return "your"
    return user.name
  }

  const sourceUserName = getUserName(activity.sourceUser, currentUser, false)
  const targetUserName = getUserName(
    activity.targetUser,
    isTargetUser,
    isTargetUser
  )

  switch (activity.type) {
    case "FOLLOW_USER":
      return (
        <p className="text-sm leading-relaxed">
          <span className="text-foreground font-semibold">
            {sourceUserName}
          </span>
          <span className="text-muted-foreground"> started following </span>
          <span className="text-foreground font-semibold">
            {activity.targetUser.name}
          </span>
        </p>
      )

    case "POST_LIKE":
      return (
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">
            <span className="text-foreground font-semibold">
              {sourceUserName}
            </span>
            <span className="text-muted-foreground"> liked </span>
            <span className="text-foreground font-semibold">
              {targetUserName}
            </span>
            <span className="text-muted-foreground"> post</span>
          </p>
          {activity.content && (
            <div className="bg-muted/50 border-primary/20 rounded-lg border-l-2 p-3">
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {activity.content}
              </p>
            </div>
          )}
        </div>
      )

    case "COMMENT_LIKE":
      return (
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">
            <span className="text-foreground font-semibold">
              {sourceUserName}
            </span>
            <span className="text-muted-foreground"> liked </span>
            <span className="text-foreground font-semibold">
              {targetUserName}
            </span>
            <span className="text-muted-foreground"> comment</span>
          </p>
          {activity.content && (
            <div className="bg-muted/50 border-primary/20 rounded-lg border-l-2 p-3">
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {activity.content}
              </p>
            </div>
          )}
        </div>
      )

    case "REPLY_LIKE":
      return (
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">
            <span className="text-foreground font-semibold">
              {sourceUserName}
            </span>
            <span className="text-muted-foreground"> liked </span>
            <span className="text-foreground font-semibold">
              {targetUserName}
            </span>
            <span className="text-muted-foreground"> reply</span>
          </p>
          {activity.content && (
            <div className="bg-muted/50 border-primary/20 rounded-lg border-l-2 p-3">
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {activity.content}
              </p>
            </div>
          )}
        </div>
      )

    default:
      return null
  }
}

// Activity Configuration
const getActivityConfig = (type: Activitytype) => {
  const configs = {
    FOLLOW_USER: {
      icon: IoPersonOutline,
      bgColor: "bg-blue-500",
      label: "Follow",
    },
    POST_LIKE: {
      icon: SlLike,
      bgColor: "bg-red-500",
      label: "Like",
    },
    COMMENT_LIKE: {
      icon: FaRegComment,
      bgColor: "bg-green-500",
      label: "Comment",
    },
    REPLY_LIKE: {
      icon: BsReplyAll,
      bgColor: "bg-purple-500",
      label: "Reply",
    },
  }
  if (type in configs) {
    return configs[type as keyof typeof configs]
  }
  // fallback config if type is not recognized
  return {
    icon: IoPersonOutline,
    bgColor: "bg-gray-400",
    label: "Activity",
  }
}

export default ActivityUser
