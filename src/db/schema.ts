import { relations } from 'drizzle-orm'
import {
  timestamp,
  pgTable,
  text,
  varchar,
  uuid,
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
    .references(() => users.id, { onDelete: 'cascade' }),
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
  orders: many(orders),
}))

export type TStoreInsertSchema = typeof stores.$inferInsert

export const billboards = pgTable(
  'billboard',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    label: varchar('label', { length: 255 }).notNull(),
    imageUrl: text('imageUrl').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (billboard) => {
    return {
      billboardsStoreIdx: index('idx_billboards_store_id').on(
        billboard.storeId
      ),
    }
  }
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
      categoriesBillboardIdx: index('idx_categories_billboard_id').on(
        category.billboardId
      ),
      categoriesStoreIdx: index('idx_categories_store_id').on(category.storeId),
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
  products: many(products),
}))

export type TCategorySelectSchema = typeof categories.$inferSelect
export type TCategoryInsertSchema = typeof categories.$inferInsert

export const sizes = pgTable(
  'size',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 55 }).notNull(),
    value: varchar('value', { length: 55 }).notNull(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (size) => {
    return {
      sizesStoreIdx: index('idx_sizes_store_id').on(size.storeId),
    }
  }
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
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 55 }).notNull(),
    value: varchar('value', { length: 55 }).notNull(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (color) => {
    return {
      colorsStoreIdx: index('idx_colors_store_id').on(color.storeId),
    }
  }
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
    id: uuid('id').defaultRandom().primaryKey(),
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
      productsStoreIdx: index('idx_products_store_id').on(product.storeId),
      productsCategoryIdx: index('idx_products_category_id').on(
        product.categoryId
      ),
      productsSizeIdx: index('idx_products_size_id').on(product.sizeId),
      productsColorIdx: index('idx_products_color_id').on(product.colorId),
    }
  }
)

export const productsRelation = relations(products, ({ many, one }) => ({
  images: many(images),
  orderItems: many(orderItems),
  store: one(stores, {
    fields: [products.sizeId],
    references: [stores.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  size: one(sizes, {
    fields: [products.sizeId],
    references: [sizes.id],
  }),
  color: one(colors, {
    fields: [products.colorId],
    references: [colors.id],
  }),
}))

export type TProductSelectSchema = typeof products.$inferSelect
export type TProductInsertSchema = typeof products.$inferInsert

export const images = pgTable(
  'image',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (image) => {
    return {
      imagesProductIdx: index('idx_images_product_id').on(image.productId),
    }
  }
)

export const imagesRelation = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}))

export type TImageSelectSchema = typeof images.$inferSelect
export type TImageInsertSchema = typeof images.$inferInsert

export const orders = pgTable(
  'order',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    phone: varchar('phone', { length: 15 }).notNull(),
    address: varchar('address', { length: 155 }).notNull(),
    isPaid: boolean('isPaid').default(false).notNull(),
    storeId: uuid('store_id')
      .references(() => stores.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (order) => {
    return {
      ordersStoreIdx: index('idx_orders_store_id').on(order.storeId),
    }
  }
)

export const ordersRelation = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
}))

export const orderItems = pgTable(
  'order_item',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .references(() => orders.id)
      .notNull(),
    productId: uuid('product_id').references(() => products.id),
  },
  (orderItem) => {
    return {
      orderItemOrderIdx: index('idx_order_item_order_id').on(orderItem.orderId),
      orderItemProductIdx: index('idx_order_item_product_id').on(
        orderItem.productId
      ),
    }
  }
)

export const orderItemsRelation = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))
