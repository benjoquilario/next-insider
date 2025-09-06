import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { env } from "@/env"

const redis = new Redis({
  url: env.UPSTASH_KV_REST_API_URL,
  token: env.UPSTASH_KV_REST_API_TOKEN,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "180s"),
})
