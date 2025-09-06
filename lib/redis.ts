import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { env } from "@/env"
import { redisOperations } from "./redis-manager"

export const redis = new Redis({
  url: env.UPSTASH_KV_REST_API_URL,
  token: env.UPSTASH_KV_REST_API_TOKEN,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "180s"),
})

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const cached = await redisOperations.get(key)
    return cached ? (JSON.parse(cached) as T) : null
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttl?: number
): Promise<void> {
  try {
    await redisOperations.set(key, JSON.stringify(data), ttl)
  } catch (error) {
    console.error("Redis set error:", error)
  }
}

export async function deleteCachedData(key: string): Promise<void> {
  try {
    await redisOperations.del(key)
  } catch (error) {
    console.error("Redis delete error:", error)
  }
}
