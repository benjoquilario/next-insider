import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as post from "./schema/post"
import { env } from "@/env.mjs"

const schema = {
  ...post,
}

const connection = postgres(env.DATABASE_URL)
export const db = drizzle(connection, { schema })
