import React from "react"
import SideBar from "./sidebar"
import Users from "./users"
import { getUsers } from "@/lib/queries"

type SectionProps = {
  children: React.ReactNode
}

const Section: React.FC<SectionProps> = async ({ children }) => {
  const usersPromise = getUsers()

  return (
    <div className="mx-auto grid size-full min-h-screen max-w-screen-xl grid-cols-12 gap-4 pb-[52px] md:px-8 md:py-4">
      <div className="col-span-3 mt-4 hidden lg:block">
        <SideBar />
      </div>
      {children}
      <div className="hidden xl:col-span-3 xl:block">
        <Users usersPromise={usersPromise as any} />
      </div>
    </div>
  )
}

export default Section
