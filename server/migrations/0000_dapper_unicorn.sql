CREATE TABLE IF NOT EXISTS "food_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cuisine" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "food_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_id" integer NOT NULL,
	"restaurant_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"zip_code" integer,
	"website" text NOT NULL,
	"cuisine" text[] DEFAULT ARRAY[]::text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"sid" text PRIMARY KEY NOT NULL,
	"data" json NOT NULL,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"passowrd" text NOT NULL,
	"first_name" text,
	"last_name" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "food_ratings" ADD CONSTRAINT "food_ratings_food_id_food_items_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "food_ratings" ADD CONSTRAINT "food_ratings_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "food_ratings" ADD CONSTRAINT "food_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
