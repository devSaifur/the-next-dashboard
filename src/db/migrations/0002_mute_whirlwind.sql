DROP INDEX IF EXISTS "idx_products_color_id";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_color_id" ON "product" ("color_id");