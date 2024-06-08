CREATE TABLE IF NOT EXISTS "billboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"label" varchar(255) NOT NULL,
	"imageUrl" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(55) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"store_id" uuid NOT NULL,
	"billboard_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "color" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(55) NOT NULL,
	"value" varchar(55) NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(15),
	"address" varchar(155),
	"isPaid" boolean DEFAULT false NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
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
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "size" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(55) NOT NULL,
	"value" varchar(55) NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billboard" ADD CONSTRAINT "billboard_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_billboard_id_billboard_id_fk" FOREIGN KEY ("billboard_id") REFERENCES "public"."billboard"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color" ADD CONSTRAINT "color_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image" ADD CONSTRAINT "image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_size_id_size_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."size"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_color_id_color_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."color"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "size" ADD CONSTRAINT "size_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store" ADD CONSTRAINT "store_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_billboards_store_id" ON "billboard" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_categories_billboard_id" ON "category" USING btree ("billboard_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_categories_store_id" ON "category" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_colors_store_id" ON "color" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_images_product_id" ON "image" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_item_order_id" ON "order_item" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_item_product_id" ON "order_item" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_store_id" ON "order" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_store_id" ON "product" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_category_id" ON "product" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_size_id" ON "product" USING btree ("size_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_color_id" ON "product" USING btree ("color_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sizes_store_id" ON "size" USING btree ("store_id");