ALTER TABLE "users" ADD COLUMN "role_id" uuid DEFAULT 'c21c5c61-64c6-4c26-9b98-5cf8ef5d1a39';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
