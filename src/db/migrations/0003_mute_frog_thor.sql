ALTER TABLE "category" DROP CONSTRAINT "category_store_id_store_id_fk";
--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "category_store_id_billboard_id_id_pk";--> statement-breakpoint
ALTER TABLE "category" ADD PRIMARY KEY ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billboard_idx" ON "category" ("billboard_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
