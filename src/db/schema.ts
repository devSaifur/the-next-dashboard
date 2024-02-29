import {
  timestamp,
  pgTable,
  text,
  varchar,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

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
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const storesRelations = relations(stores, ({ many }) => ({
  billboards: many(billboards),
  categories: many(categories),
  sizes: many(sizes),
}))

export type TStoreInsertSchema = typeof stores.$inferInsert

export const billboards = pgTable(
  'billboard',
  {
    id: uuid('id').defaultRandom().notNull(),
    storeId: uuid('storeId')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    label: varchar('label', { length: 255 }).notNull(),
    imageUrl: text('imageUrl').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (billboard) => ({
    compoundKey: primaryKey({
      columns: [billboard.id, billboard.storeId],
    }),
  })
)

export const billboardsRelations = relations(billboards, ({ one, many }) => ({
  store: one(stores, {
    fields: [billboards.storeId],
    references: [stores.id],
  }),
  categories: many(categories),
}))

export type TBillboardInsertSchema = typeof billboards.$inferInsert
export type TBillboardSelectSchema = typeof billboards.$inferSelect

export const categories = pgTable(
  'category',
  {
    id: uuid('id').defaultRandom().notNull(),
    name: varchar('name', { length: 55 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    storeId: uuid('storeId')
      .references(() => stores.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    billboardId: uuid('billboardId')
      .references(() => billboards.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (category) => ({
    compoundKey: primaryKey({
      columns: [category.storeId, category.billboardId, category.id],
    }),
  })
)

export const categoriesRelations = relations(categories, ({ one }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  billboard: one(billboards, {
    fields: [categories.billboardId],
    references: [billboards.id],
  }),
}))

export type TCategorySelectSchema = typeof categories.$inferSelect
export type TCategoryInsertSchema = typeof categories.$inferInsert

export const sizes = pgTable(
  'size',
  {
    id: uuid('id').defaultRandom(),
    name: varchar('name', { length: 55 }).notNull(),
    value: varchar('value', { length: 55 }).notNull(),
    storeId: uuid('storeId')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    createAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('created_at').notNull(),
  },
  (size) => ({
    compoundKey: primaryKey({
      columns: [size.id, size.storeId],
    }),
  })
)

export const sizesRelation = relations(sizes, ({ one }) => ({
  store: one(stores, {
    fields: [sizes.storeId],
    references: [stores.id],
  }),
}))
