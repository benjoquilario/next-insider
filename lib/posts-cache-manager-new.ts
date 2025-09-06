import { redis } from "./redis"

export class PostsCacheManager {
  private static readonly CACHE_PREFIX = "posts"
  private static readonly USER_CACHE_PREFIX = "user_posts"
  private static readonly GLOBAL_FEED_PREFIX = "global_feed"

  // Cache TTL in seconds
  private static readonly FEED_TTL = 300 // 5 minutes
  private static readonly USER_POSTS_TTL = 600 // 10 minutes

  /**
   * Generate cache key for global feed
   */
  static getFeedCacheKey(
    userId: string | null,
    skip: number,
    limit: number
  ): string {
    const userKey = userId || "anonymous"
    return `${this.CACHE_PREFIX}:${this.GLOBAL_FEED_PREFIX}:${userKey}:skip:${skip}:limit:${limit}`
  }

  /**
   * Generate cache key for user-specific posts
   */
  static getUserPostsCacheKey(
    userId: string,
    skip: number,
    limit: number
  ): string {
    return `${this.CACHE_PREFIX}:${this.USER_CACHE_PREFIX}:${userId}:skip:${skip}:limit:${limit}`
  }

  /**
   * Generate cache key pattern for invalidation
   */
  static getUserCachePattern(userId: string): string {
    return `${this.CACHE_PREFIX}:*${userId}*`
  }

  /**
   * Generate cache key pattern for global feed invalidation
   */
  static getGlobalFeedPattern(): string {
    return `${this.CACHE_PREFIX}:${this.GLOBAL_FEED_PREFIX}:*`
  }

  /**
   * Cache posts data
   */
  static async cachePosts(
    key: string,
    data: any[],
    ttl: number = this.FEED_TTL
  ): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to cache posts:", error)
    }
  }

  /**
   * Get cached posts
   */
  static async getCachedPosts<T>(key: string): Promise<T[] | null> {
    try {
      const cached = await redis.get(key)
      return cached && typeof cached === "string" ? JSON.parse(cached) : null
    } catch (error) {
      console.error("Failed to get cached posts:", error)
      return null
    }
  }

  /**
   * Invalidate cache when new post is created
   */
  static async invalidateOnNewPost(authorId: string): Promise<void> {
    try {
      // Get all keys that might be affected
      const globalFeedKeys = await redis.keys(this.getGlobalFeedPattern())
      const userPostsKeys = await redis.keys(this.getUserCachePattern(authorId))

      // Delete all affected cache entries
      const allKeys = [...globalFeedKeys, ...userPostsKeys]
      if (allKeys.length > 0) {
        await redis.del(...allKeys)
      }
    } catch (error) {
      console.error("Failed to invalidate cache on new post:", error)
    }
  }

  /**
   * Invalidate cache when post is liked/unliked
   */
  static async invalidateOnPostInteraction(
    postId: string,
    authorId: string
  ): Promise<void> {
    try {
      // Invalidate global feeds and user-specific caches
      const globalFeedKeys = await redis.keys(this.getGlobalFeedPattern())
      const userPostsKeys = await redis.keys(this.getUserCachePattern(authorId))

      const allKeys = [...globalFeedKeys, ...userPostsKeys]
      if (allKeys.length > 0) {
        await redis.del(...allKeys)
      }
    } catch (error) {
      console.error("Failed to invalidate cache on post interaction:", error)
    }
  }

  /**
   * Invalidate all user-related cache
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    try {
      const userKeys = await redis.keys(this.getUserCachePattern(userId))
      if (userKeys.length > 0) {
        await redis.del(...userKeys)
      }
    } catch (error) {
      console.error("Failed to invalidate user cache:", error)
    }
  }

  /**
   * Clear all posts cache (use sparingly)
   */
  static async clearAllPostsCache(): Promise<void> {
    try {
      const allPostsKeys = await redis.keys(`${this.CACHE_PREFIX}:*`)
      if (allPostsKeys.length > 0) {
        await redis.del(...allPostsKeys)
      }
    } catch (error) {
      console.error("Failed to clear all posts cache:", error)
    }
  }
}
