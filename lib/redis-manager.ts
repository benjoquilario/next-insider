import { redis } from "./redis"

// Utility functions for common Redis operations (using main Redis)
export const redisOperations = {
  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key)
    } catch (error) {
      console.error(`❌ Redis GET error for key ${key}:`, error)
      return null
    }
  },

  async set(
    key: string,
    value: string,
    expireInSeconds?: number
  ): Promise<boolean> {
    try {
      if (expireInSeconds) {
        await redis.setex(key, expireInSeconds, value)
      } else {
        await redis.set(key, value)
      }
      return true
    } catch (error) {
      console.error(`❌ Redis SET error for key ${key}:`, error)
      return false
    }
  },

  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error(`❌ Redis DEL error for key ${key}:`, error)
      return false
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.error(`❌ Redis EXISTS error for key ${key}:`, error)
      return false
    }
  },

  async incr(key: string): Promise<number | null> {
    try {
      return await redis.incr(key)
    } catch (error) {
      console.error(`❌ Redis INCR error for key ${key}:`, error)
      return null
    }
  },

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      await redis.expire(key, seconds)
      return true
    } catch (error) {
      console.error(`❌ Redis EXPIRE error for key ${key}:`, error)
      return false
    }
  },
}
