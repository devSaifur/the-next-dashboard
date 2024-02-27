CREATE TABLE IF NOT EXISTS "billboard" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"storeId" uuid NOT NULL,
	"label" varchar(255) NOT NULL,
	"imageUrl" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "billboard_id_storeId_pk" PRIMARY KEY("id","storeId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(55) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp NOT NULL,
	"storeId" uuid,
	"billboardId" uuid,
	CONSTRAINT "category_storeId_billboardId_id_pk" PRIMARY KEY("storeId","billboardId","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "size" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(55) NOT NULL,
	"value" varchar(55) NOT NULL,
	"storeId" uuid,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "size_id_storeId_pk" PRIMARY KEY("id","storeId")
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
 ALTER TABLE "billboard" ADD CONSTRAINT "billboard_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_billboardId_billboard_id_fk" FOREIGN KEY ("billboardId") REFERENCES "billboard"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "size" ADD CONSTRAINT "size_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store" ADD CONSTRAINT "store_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
