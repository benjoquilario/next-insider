import { db } from "@/db"
import { desc } from "drizzle-orm"
import { posts } from "@/db/schema"

export const getPosts = async (limit = 5, skip = 0) => {
  const getPosts = await db.query.posts.findMany({
    with: {
      images: true,
      author: true,
    },
    limit: Number(limit) || 5,
    offset: Number(skip) || 0,
    orderBy: desc(posts.createdAt),
  })

  if (getPosts.length === 0) {
    return {
      data: [],
      hasNextPage: false,
      nextOffset: null,
    }
  }

  return {
    data: getPosts,
    hasNextPage: getPosts.length < (Number(limit) || 5) ? false : true,
    nextOffset:
      getPosts.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  }
}
