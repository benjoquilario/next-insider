"use client"

import React from "react"
import { CiAt, CiMail, CiCalendar, CiPhone, CiGlobe } from "react-icons/ci"
import { IoMdPerson } from "react-icons/io"
import { MdOutlineTransgender } from "react-icons/md"
import { FaRegHeart, FaAddressBook } from "react-icons/fa"
import { type UserProfile } from "@/types"

const About = ({
  profilePromise,
}: {
  profilePromise: Promise<UserProfile>
}) => {
  const userProfile = React.use(profilePromise)

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-2">
        <AboutItem
          Icon={<CiAt />}
          itemName="username"
          itemValue={`${userProfile?.name?.split(" ").join("").toLowerCase()}`}
        />
        <AboutItem
          Icon={<CiMail />}
          itemName="email"
          itemValue={userProfile?.email ?? "not set"}
        />
        <AboutItem
          Icon={<IoMdPerson />}
          itemName="name"
          itemValue={userProfile?.name ?? "not set"}
        />
        <AboutItem
          Icon={<CiCalendar />}
          itemName="birth date"
          itemValue={userProfile?.birthDate ?? "not set"}
        />
        <AboutItem
          Icon={<MdOutlineTransgender />}
          itemName="gender"
          itemValue={userProfile?.gender ?? "not set"}
        />
        <AboutItem
          Icon={<FaRegHeart />}
          itemName="relationship status"
          itemValue={userProfile?.relationshipStatus ?? "not set"}
        />
        <AboutItem
          Icon={<CiPhone />}
          itemName="phone number"
          itemValue={`${userProfile?.phoneNumber ?? "not set"}`}
        />
        <AboutItem
          Icon={<CiGlobe />}
          itemName="website"
          itemValue={userProfile?.website ?? "not set"}
        />
        <AboutItem
          Icon={<FaAddressBook />}
          itemName="address"
          itemValue={userProfile?.address ?? "not set"}
        />
      </div>
    </div>
  )
}

type AboutItemProps = {
  Icon: any
  itemName: string
  itemValue: string | Date
}

const AboutItem = (props: AboutItemProps) => {
  const { Icon, itemName, itemValue } = props

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 rounded-l-3xl bg-input p-2 sm:gap-3 sm:p-4">
        {Icon}
        <p className="font-medium capitalize">{itemName}</p>
      </div>
      <p className="flex flex-1 items-center self-stretch rounded-r-3xl border border-border pl-4">
        {itemValue.toString()}
      </p>
    </div>
  )
}

export default About
