import React from "react"
import SideBar from "./sidebar"
import Users from "./users"

type SectionProps = {
  children: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ children }) => {
  return (
    <div className="mx-auto grid size-full min-h-screen max-w-screen-xl grid-cols-12 gap-6 pb-[52px] md:px-14 md:py-4">
      <div className="col-span-3 hidden lg:block">{/* <SideBar /> */}</div>
      {children}
      <div className="hidden xl:col-span-3 xl:block">{/* <Users /> */}</div>
    </div>
  )
}

export default Section
