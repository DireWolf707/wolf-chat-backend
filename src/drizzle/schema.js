import { pgTable, text, timestamp, uniqueIndex, index, uuid, varchar, primaryKey, foreignKey, boolean } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"

export const userT = pgTable(
  "User",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    username: varchar("username", { length: 256 }).notNull(),
    avatar: varchar("avatar", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (userT) => ({
    usernameIdx: uniqueIndex("username_idx").on(userT.username),
    emailIdx: uniqueIndex("email_idx").on(userT.email),
  })
)

export const userSchema = createInsertSchema(userT)

export const friendT = pgTable(
  "Friend",
  {
    to: uuid("to")
      .references(() => userT.id)
      .notNull(),
    from: uuid("from")
      .references(() => userT.id)
      .notNull(),
    isRequestAccepted: boolean("is_request_accepted").default(false).notNull(),
  },
  (friendT) => ({
    pk: primaryKey(friendT.to, friendT.from),
    oppositeIdx: uniqueIndex(friendT.from, friendT.to), // until unique constraint is availabe in drizzle
  })
)

export const chatT = pgTable("Chat", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => userT.id)
    .notNull(),
  chatRoomId: uuid("chat_room_id")
    .references(() => chatRoomT.id)
    .notNull(),
  type: varchar("type", { length: 6, enum: ["text", "img", "vid"] }).notNull(),
  content: varchar("content", { length: 255 }).notNull(),
})

export const chatRoomT = pgTable("ChatRoom", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  lastChatId: uuid("last_chat_id").references(() => chatT.id),
  isGroup: boolean("is_group").default(false).notNull(),
  name: varchar("name", { length: 255 }),
})

export const participantT = pgTable(
  "Participant",
  {
    userId: uuid("user_id")
      .references(() => userT.id)
      .notNull(),
    chatRoomId: uuid("chat_room_id")
      .references(() => chatRoomT.id)
      .notNull(),
    lastChatSeenId: uuid("last_chat_id").references(() => chatT.id),
  },
  (participantT) => ({
    pk: primaryKey(participantT.userId, participantT.chatRoomId),
  })
)
