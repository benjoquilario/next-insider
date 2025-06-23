"use client"

import React from "react"
import { CiAt, CiMail, CiCalendar, CiPhone, CiGlobe } from "react-icons/ci"
import { IoMdPerson } from "react-icons/io"
import { MdOutlineTransgender } from "react-icons/md"
import { FaRegHeart, FaAddressBook } from "react-icons/fa"
import { type UserProfile } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

type AboutItemProps = {
  Icon: React.ReactElement
  itemName: string
  itemValue: string | Date
}

const AboutItem = React.memo(({ Icon, itemName, itemValue }: AboutItemProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="flex items-center group"
    whileHover={{ scale: 1.01, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
  >
    <div className="flex items-center gap-2 rounded-l-3xl bg-input p-2 sm:gap-3 sm:p-4 transition-colors group-hover:bg-primary/10">
      {Icon}
      <p className="font-medium capitalize text-foreground/90 group-hover:text-primary transition-colors">
        {itemName}
      </p>
    </div>
    <p className="flex flex-1 items-center self-stretch rounded-r-3xl border border-border pl-4 bg-background/80 group-hover:bg-background/90 transition-colors">
      {itemValue.toString()}
    </p>
  </motion.div>
))
AboutItem.displayName = "AboutItem"

const About = ({
  profilePromise,
}: {
  profilePromise: Promise<UserProfile>
}) => {
  const userProfile = React.use(profilePromise)
  const aboutItems = [
    { Icon: <CiAt />, itemName: "username", itemValue: `${userProfile?.name?.split(" ").join("").toLowerCase()}` },
    { Icon: <CiMail />, itemName: "email", itemValue: userProfile?.email ?? "not set" },
    { Icon: <IoMdPerson />, itemName: "name", itemValue: userProfile?.name ?? "not set" },
    { Icon: <CiCalendar />, itemName: "birth date", itemValue: userProfile?.birthDate ?? "not set" },
    { Icon: <MdOutlineTransgender />, itemName: "gender", itemValue: userProfile?.gender ?? "not set" },
    { Icon: <FaRegHeart />, itemName: "relationship status", itemValue: userProfile?.relationshipStatus ?? "not set" },
    { Icon: <CiPhone />, itemName: "phone number", itemValue: `${userProfile?.phoneNumber ?? "not set"}` },
    { Icon: <CiGlobe />, itemName: "website", itemValue: userProfile?.website ?? "not set" },
    { Icon: <FaAddressBook />, itemName: "address", itemValue: userProfile?.address ?? "not set" },
  ]

  return (
    <div className="mt-4">
      <motion.div
        className="flex flex-col gap-2"
        initial="hidden"
        animate="visible"
        variants={{}}
      >
        <AnimatePresence>
          {aboutItems.map((item, idx) => (
            <AboutItem
              key={item.itemName}
              {...item}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default About
