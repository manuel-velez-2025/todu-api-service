CREATE TABLE "tasks" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"xp_value" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"proof_url" varchar(500),
	"proof_status" varchar(20),
	"proof_reason" text,
	"proof_confidence" varchar(10),
	"created_at" timestamp DEFAULT now()
);
