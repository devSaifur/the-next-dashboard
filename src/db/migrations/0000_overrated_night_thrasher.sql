CREATE TABLE IF NOT EXISTS "TND_billboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"label" varchar(255) NOT NULL,
	"imageUrl" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(55) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"store_id" uuid NOT NULL,
	"billboard_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_color" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(55) NOT NULL,
	"value" varchar(55) NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(15),
	"address" varchar(155),
	"isPaid" boolean DEFAULT false NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric NOT NULL,
	"is_featured" boolean DEFAULT false,
	"is_archived" boolean DEFAULT false,
	"store_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"size_id" uuid NOT NULL,
	"color_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_size" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(55) NOT NULL,
	"value" varchar(55) NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_store" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TND_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_billboard" ADD CONSTRAINT "TND_billboard_store_id_TND_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."TND_store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_category" ADD CONSTRAINT "TND_category_store_id_TND_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."TND_store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_category" ADD CONSTRAINT "TND_category_billboard_id_TND_billboard_id_fk" FOREIGN KEY ("billboard_id") REFERENCES "public"."TND_billboard"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_color" ADD CONSTRAINT "TND_color_store_id_TND_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."TND_store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_image" ADD CONSTRAINT "TND_image_product_id_TND_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."TND_product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_order_item" ADD CONSTRAINT "TND_order_item_order_id_TND_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."TND_order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_order_item" ADD CONSTRAINT "TND_order_item_product_id_TND_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."TND_product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_order" ADD CONSTRAINT "TND_order_store_id_TND_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."TND_store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_product" ADD CONSTRAINT "TND_product_store_id_TND_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."TND_store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_product" ADD CONSTRAINT "TND_product_category_id_TND_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."TND_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_product" ADD CONSTRAINT "TND_product_size_id_TND_size_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."TND_size"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_product" ADD CONSTRAINT "TND_product_color_id_TND_color_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."TND_color"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_session" ADD CONSTRAINT "TND_session_user_id_TND_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."TND_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_size" ADD CONSTRAINT "TND_size_store_id_TND_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."TND_store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TND_store" ADD CONSTRAINT "TND_store_userId_TND_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."TND_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_billboards_store_id" ON "TND_billboard" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_categories_billboard_id" ON "TND_category" USING btree ("billboard_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_categories_store_id" ON "TND_category" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_colors_store_id" ON "TND_color" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_images_product_id" ON "TND_image" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_item_order_id" ON "TND_order_item" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_item_product_id" ON "TND_order_item" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_store_id" ON "TND_order" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_store_id" ON "TND_product" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_category_id" ON "TND_product" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_size_id" ON "TND_product" USING btree ("size_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_color_id" ON "TND_product" USING btree ("color_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sizes_store_id" ON "TND_size" USING btree ("store_id");