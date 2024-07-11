import React from "react"
import { getFollowersFromUserId } from "@/lib/metrics"
import Image from "next/image"
import Link from "next/link"
import { MdPersonAddDisabled } from "react-icons/md"

const FollowerPage = async ({ params }: { params: { userId: string } }) => {
  const userId = params.userId

  const followers = await getFollowersFromUserId({ userId })

  return (
    <div className="col-span-full lg:col-span-9 xl:col-span-6">
      <div className="mb-2 text-2xl font-semibold">Followers</div>
      <ul className="space-y-1">
        {followers.length === 0 ? (
          <>
            <MdPersonAddDisabled className="h-12 w-12" />
            <span className="text-center">
              You don't have any followers ☹️. The trick is to follow someone
              and then wait for them to follow you back.
            </span>
          </>
        ) : (
          followers.map(({ follower: { id, name, image, _count } }) => (
            <li
              key={id}
              className="relative h-16 w-full overflow-hidden rounded-md hover:bg-secondary"
            >
              <Link
                href={`/profile/${id || ""}`}
                className="outline-offset-2 transition duration-75 hover:bg-secondary focus:outline-none focus:ring focus:ring-offset-2"
              >
                <div className="absolute inset-0 flex items-center overflow-hidden rounded-md border border-secondary/80">
                  <div className="ml-3">
                    <div className="relative h-12 w-12 rounded-md">
                      <Image
                        className="rounded-full"
                        src={image || "/default-image.png"}
                        alt={name ?? ""}
                        layout="fill"
                      />
                    </div>
                  </div>
                  <div className="ml-4 flex-1 text-foreground">
                    <h3 className="text-sm font-semibold capitalize leading-tight">
                      {name ?? ""}
                    </h3>
                    <p className="text-xs">{_count.followers} Followers</p>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default FollowerPage
