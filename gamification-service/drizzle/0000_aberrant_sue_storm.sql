CREATE TABLE "user_progress" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"xp_actual" integer DEFAULT 0 NOT NULL,
	"nivel" integer DEFAULT 1 NOT NULL,
	"racha_actual" integer DEFAULT 0 NOT NULL,
	"ultima_actividad" timestamp DEFAULT now() NOT NULL,
	"tareas_completadas" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_user_id_unique" UNIQUE("user_id")
);
