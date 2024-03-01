CREATE TABLE IF NOT EXISTS "color" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(55) NOT NULL,
	"value" varchar(55) NOT NULL,
	"storeId" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "color_id_storeId_pk" PRIMARY KEY("id","storeId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color" ADD CONSTRAINT "color_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
