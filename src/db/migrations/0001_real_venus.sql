DROP INDEX IF EXISTS "idx_categories_product_id";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_categories_billboard_id" ON "category" ("billboard_id");