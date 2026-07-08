CREATE TABLE "robot_state" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"emotion" varchar(20) DEFAULT 'sleepy' NOT NULL,
	"nivel" integer DEFAULT 1 NOT NULL,
	"ultima_actividad" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "robot_state_user_id_unique" UNIQUE("user_id")
);
