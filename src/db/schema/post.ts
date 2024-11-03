import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  uuid,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "./auth"

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  authorId: uuid("author_id").notNull(),
})

export const postImages = pgTable("post_images", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileKey: varchar("file_key", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const postsRelations = relations(posts, ({ many, one }) => ({
  images: many(postImages),
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

export const postImagesRelations = relations(postImages, ({ one }) => ({
  post: one(posts, {
    fields: [postImages.postId],
    references: [posts.id],
  }),
}))
