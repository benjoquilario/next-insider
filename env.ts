import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    UPSTASH_KV_REST_API_TOKEN: z.string(),
    UPSTASH_KV_REST_API_URL: z.string().url(),
    JWT_SECRET: z.string(),
    SESSION_SECRET: z.string(),
    UPLOADTHING_TOKEN: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    UPSTASH_KV_REST_API_TOKEN: process.env.UPSTASH_KV_REST_API_TOKEN,
    UPSTASH_KV_REST_API_URL: process.env.UPSTASH_KV_REST_API_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
