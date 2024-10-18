CREATE TABLE IF NOT EXISTS "cuisines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "cuisines_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurans_cuisines" (
	"restaurant_id" integer NOT NULL,
	"cuisine_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurant_food_items" (
	"food_id" integer NOT NULL,
	"restaurant_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurans_cuisines" ADD CONSTRAINT "restaurans_cuisines_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurans_cuisines" ADD CONSTRAINT "restaurans_cuisines_cuisine_id_cuisines_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."cuisines"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_food_items" ADD CONSTRAINT "restaurant_food_items_food_id_food_items_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_food_items" ADD CONSTRAINT "restaurant_food_items_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_restaurant_cuisine" ON "restaurans_cuisines" USING btree ("restaurant_id","cuisine_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_restaurant_food_item" ON "restaurant_food_items" USING btree ("restaurant_id","food_id");--> statement-breakpoint
ALTER TABLE "restaurants" DROP COLUMN IF EXISTS "cuisines";