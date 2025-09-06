"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/lib/auth"
import dayjs from "@/lib/time"

// Helper to get notification link
function getNotificationLink(n: any) {
  if (n.postId) return `/post/${n.postId}`
  if (n.commentId) return `/post/${n.postId ?? ""}#comment-${n.commentId}`
  if (n.replyId) return `/post/${n.postId ?? ""}#reply-${n.replyId}`
  return "#"
}

// Helper to get notification label
function getNotificationLabel(n: any, currentUserId: string) {
  switch (n.type) {
    case "FOLLOW":
      return `${n.fromUser?.name ?? "Someone"} followed you.`
    case "POST_LIKE":
      return `${n.fromUser?.name ?? "Someone"} liked your post.`
    case "COMMENT":
      return `${n.fromUser?.name ?? "Someone"} commented on your post.`
    case "REPLY":
      return `${n.fromUser?.name ?? "Someone"} replied to your comment.`
    case "COMMENT_LIKE":
      return `${n.fromUser?.name ?? "Someone"} liked your comment.`
    case "REPLY_LIKE":
      return `${n.fromUser?.name ?? "Someone"} liked your reply.`
    default:
      return n.message || "You have a new notification."
  }
}

export default function NotificationsPage() {
  const { session } = useUser()
  const userId = session?.id

  // Fetch notifications for the current user
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(`/api/notifications?userId=${userId}`)
      return res.json()
    },
  })

  return (
    <div className="col-span-full lg:col-span-9 xl:col-span-6">
      <h1 className="text-3xl font-semibold">Notifications</h1>
      <motion.ul
        layout
        className="mt-4 flex flex-col gap-3"
        initial="hidden"
        animate="visible"
        variants={{}}
      >
        <AnimatePresence>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.li
                key={`notif-skeleton-${i}`}
                className="bg-secondary flex animate-pulse items-center gap-3 rounded-xl p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-primary/10 size-12 rounded-full" />
                <div className="flex flex-col gap-2">
                  <div className="bg-primary/10 h-5 w-40 rounded-md" />
                  <div className="bg-primary/10 h-4 w-24 rounded-md" />
                </div>
              </motion.li>
            ))
          ) : notifications && notifications.length > 0 ? (
            notifications.map((n: any, idx: number) => (
              <motion.li
                key={n.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: idx * 0.07,
                  ease: "easeInOut",
                }}
                className={`flex items-center gap-3 rounded-xl p-4 shadow transition-shadow hover:shadow-lg ${n.isRead ? "bg-background" : "bg-secondary/80"}`}
              >
                <Avatar className="size-12">
                  <AvatarImage
                    src={n.fromUser?.image ?? "/default-image.png"}
                    alt={n.fromUser?.name ?? "User"}
                  />
                  <AvatarFallback>
                    <div className="bg-primary/10 size-full animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-1">
                  <Link
                    href={getNotificationLink(n)}
                    className="font-medium hover:underline"
                  >
                    {getNotificationLabel(n, userId ?? "")}
                  </Link>
                  <span className="text-muted-foreground text-xs">
                    {dayjs(n.createdAt).fromNow()}
                  </span>
                </div>
                {!n.isRead && (
                  <span className="bg-primary ml-2 inline-block size-2 rounded-full" />
                )}
              </motion.li>
            ))
          ) : (
            <motion.li
              key="no-notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground py-12 text-center text-lg"
            >
              No notifications yet.
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
