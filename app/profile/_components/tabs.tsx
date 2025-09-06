"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Posts from "./posts"
import ActivityUser from "./activity"

const TabsProfile = ({
  userId,
  isUserPost,
  children,
}: {
  userId: string
  isUserPost: boolean
  children: React.ReactNode
}) => {
  return (
    <Tabs defaultValue="post" className="flex w-full flex-col">
      <TabsList className="flex w-full justify-start bg-background p-0">
        <TabsTrigger value="post" className="h-full">
          Posts
        </TabsTrigger>
        <TabsTrigger value="about" className="h-full">
          About
        </TabsTrigger>
        <TabsTrigger value="activity" className="h-full">
          Activity
        </TabsTrigger>
      </TabsList>
      <TabsContent value="post" className="mt-0">
        <Posts isUserPost={isUserPost} userId={userId} />
      </TabsContent>
      <TabsContent value="about">{children}</TabsContent>
      <TabsContent value="activity">
        <ActivityUser userId={userId} />
      </TabsContent>
    </Tabs>
  )
}
export default TabsProfile
