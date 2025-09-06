import React from "react"
import MobileNav from "./mobile-nav"

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="mx-auto flex w-full flex-col">
      {children}

      <MobileNav />
    </main>
  )
}

export default Layout
