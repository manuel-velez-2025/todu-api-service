CREATE TABLE "robots" (
	"user_id" varchar(36) PRIMARY KEY NOT NULL,
	"expression" varchar(20) DEFAULT 'Smiling' NOT NULL,
	"accessory" varchar(20) DEFAULT 'None' NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "robots" ADD CONSTRAINT "robots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
