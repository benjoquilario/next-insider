import React from "react"

const ProfileSkeleton = () => {
  return (
    <div className="mb-3 w-full animate-pulse rounded-md shadow">
      <div className="relative h-56 w-full rounded-t opacity-80">
        <div className="bg-accent absolute right-3 bottom-3 size-8 rounded-full"></div>
      </div>
      <div className="z-10 flex flex-col items-center justify-center gap-3 rounded-b-md p-6 px-4 pt-2 sm:flex-row sm:justify-start">
        <div className="relative -mt-20">
          <div className="bg-accent size-28 rounded-full"></div>
        </div>
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <div className="space-y-2">
            <div className="bg- h-6 w-48 rounded"></div>
            <div className="bg-accent m-auto h-4 w-36 rounded sm:m-0"></div>
            <div className="bg-accent m-auto h-3 w-32 rounded sm:m-0"></div>
          </div>
          <div className="bg-accent mt-2 h-5 w-28 rounded md:mt-0"></div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSkeleton
