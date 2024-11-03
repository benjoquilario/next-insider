import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as post from "./schema/post"
import * as auth from "./schema/auth"
import * as comment from "./schema/comment"
import { env } from "@/env.mjs"

const schema = {
  ...post,
  ...auth,
  ...comment,
}

const connection = postgres(env.DATABASE_URL)
export const db = drizzle(connection, { schema })
