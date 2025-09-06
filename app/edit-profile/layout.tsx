import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Profile",
}

interface EditProfileLayoutProps {
  children: React.ReactNode
}

const EditProfileLayout = (props: EditProfileLayoutProps) => {
  const { children } = props

  return (
    <div className="mx-auto mb-4 flex w-full max-w-3xl flex-col items-center justify-center px-4 md:px-0">
      {children}
    </div>
  )
}

export default EditProfileLayout
