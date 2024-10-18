ALTER TABLE "restaurants" RENAME COLUMN "cuisine" TO "cuisines";--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "zip_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "website" DROP NOT NULL;