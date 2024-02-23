import { relations } from 'drizzle-orm'
import { timestamp, pgTable, text, varchar, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  password: text('password'),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const stores = pgTable('store', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updatedAt: timestamp('updated_at').notNull(),
})

export type TStoreInsertSchema = typeof stores.$inferInsert

export const StoreSelectSchema = createSelectSchema(stores)
export type TStoreSelectSchema = z.infer<typeof StoreSelectSchema>

export const billboards = pgTable('billboard', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('storeId')
    .references(() => stores.id)
    .notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  imageUrl: text('imageUrl').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const BillboardInsertSchema = createInsertSchema(billboards)
export type TBillboardInsertSchema = z.infer<typeof BillboardInsertSchema>

export const storesRelations = relations(stores, ({ many }) => ({
  billboards: many(billboards),
}))

export const billboardsRelations = relations(billboards, ({ one }) => ({
  store: one(stores, {
    fields: [billboards.storeId],
    references: [stores.id],
  }),
}))
