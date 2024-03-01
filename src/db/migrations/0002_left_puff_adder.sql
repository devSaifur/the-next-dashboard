ALTER TABLE "size" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "size" ADD COLUMN "updated_at" timestamp NOT NULL;