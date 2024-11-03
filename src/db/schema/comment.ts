import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { posts } from "./post"
import { users } from "./auth"

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  authorId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const commentRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}))

export const usersRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}))
