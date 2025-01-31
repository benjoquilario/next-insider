"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegCircle } from "react-icons/fa"
import Nav from "@/components/nav"
import React from "react"
import SignOut from "./sign-out"

const SideBar = () => {
  return (
    <div className="sticky top-0">
      <Link
        href={`/profile/`}
        className="focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
      >
        <div className="flex h-14 w-full items-center justify-start gap-2 px-5 text-2xl font-light">
          <span className="text-primary">
            <FaRegCircle />
          </span>
          <span className="text-3xl font-bold uppercase text-primary">
            Insider
          </span>
        </div>
      </Link>
      <div className="rounded px-4 py-5">
        <div className="flex justify-start">
          <Link href={`/profile/`} className="flex items-center gap-1">
            <div>
              <Avatar>
                <AvatarImage src={"/default-image.png"} alt={""} />
                <AvatarFallback>
                  <div className="size-full animate-pulse"></div>
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium capitalize">BenJo QuiLario</h3>
            </div>
          </Link>
        </div>
      </div>
      <Nav />
      <div className="mt-28">
        <SignOut />
      </div>
    </div>
  )
}

export default SideBar
