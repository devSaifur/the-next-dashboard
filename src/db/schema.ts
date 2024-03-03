import { relations } from 'drizzle-orm'
import {
  timestamp,
  pgTable,
  text,
  varchar,
  uuid,
  primaryKey,
  decimal,
  boolean,
  index,
} from 'drizzle-orm/pg-core'

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
  colors: many(colors),
  products: many(products),
}))

export type TStoreInsertSchema = typeof stores.$inferInsert

export const billboards = pgTable(
  'billboard',
  {
    id: uuid('id').defaultRandom().notNull(),
    storeId: uuid('store_id')
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
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    name: varchar('name', { length: 55 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    storeId: uuid('store_id')
      .references(() => stores.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    billboardId: uuid('billboard_id')
      .references(() => billboards.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (category) => {
    return {
      billboardIdx: index('billboard_idx').on(category.billboardId),
    }
  }
)

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  billboard: one(billboards, {
    fields: [categories.billboardId],
    references: [billboards.id],
  }),
  product: many(products),
}))

export type TCategorySelectSchema = typeof categories.$inferSelect
export type TCategoryInsertSchema = typeof categories.$inferInsert

export const sizes = pgTable(
  'size',
  {
    id: uuid('id').defaultRandom().notNull(),
    name: varchar('name', { length: 55 }).notNull(),
    value: varchar('value', { length: 55 }).notNull(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (size) => ({
    compoundKey: primaryKey({
      columns: [size.id, size.storeId],
    }),
  })
)

export const sizesRelation = relations(sizes, ({ one, many }) => ({
  store: one(stores, {
    fields: [sizes.storeId],
    references: [stores.id],
  }),
  product: many(products),
}))

export type TSizeSelectSchema = typeof sizes.$inferSelect

export const colors = pgTable(
  'color',
  {
    id: uuid('id').defaultRandom().notNull(),
    name: varchar('name', { length: 55 }).notNull(),
    value: varchar('value', { length: 55 }).notNull(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (color) => ({
    compoundKey: primaryKey({
      columns: [color.id, color.storeId],
    }),
  })
)

export const colorsRelation = relations(colors, ({ one, many }) => ({
  store: one(stores, {
    fields: [colors.storeId],
    references: [stores.id],
  }),
  product: many(products),
}))

export type TColorSelectSchema = typeof colors.$inferSelect

export const products = pgTable(
  'product',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    price: decimal('price').notNull(),
    isFeatured: boolean('is_featured').default(false),
    isArchived: boolean('is_archived').default(false),
    storeId: uuid('store_id')
      .references(() => stores.id)
      .notNull(),
    categoryId: uuid('category_id')
      .references(() => categories.id)
      .notNull(),
    sizeId: uuid('size_id')
      .references(() => sizes.id)
      .notNull(),
    colorId: uuid('color_id')
      .references(() => colors.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (product) => {
    return {
      storeIdx: index('store_idx').on(product.storeId),
      categoryIdx: index('category_idx').on(product.categoryId),
      sizeIdx: index('size_idx').on(product.sizeId),
      colorIdx: index('color_idx').on(product.categoryId),
    }
  }
)

export const productsRelation = relations(products, ({ many }) => ({
  image: many(images),
}))

export const images = pgTable(
  'image',
  {
    id: uuid('id').defaultRandom().notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (image) => ({
    compoundKey: primaryKey({
      columns: [image.id, image.productId],
    }),
  })
)

export const imagesRelation = relations(images, ({ one }) => ({
  image: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}))
