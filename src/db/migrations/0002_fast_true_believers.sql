ALTER TABLE "order_item" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "isPaid" SET NOT NULL;