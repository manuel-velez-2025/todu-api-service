CREATE TABLE "place_summaries" (
	"place_id" varchar(500) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(500) NOT NULL,
	"tip" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
