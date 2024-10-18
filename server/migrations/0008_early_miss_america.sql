ALTER TABLE "restaurans_cuisines" RENAME TO "restaurant_cuisines";--> statement-breakpoint
ALTER TABLE "restaurant_cuisines" DROP CONSTRAINT "restaurans_cuisines_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "restaurant_cuisines" DROP CONSTRAINT "restaurans_cuisines_cuisine_id_cuisines_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_cuisines" ADD CONSTRAINT "restaurant_cuisines_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_cuisines" ADD CONSTRAINT "restaurant_cuisines_cuisine_id_cuisines_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."cuisines"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
