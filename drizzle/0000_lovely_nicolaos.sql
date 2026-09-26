CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`sector` text NOT NULL,
	`pathway` text NOT NULL,
	`intended_use` text NOT NULL,
	`programme` text DEFAULT '' NOT NULL,
	`annual_mitigation` integer DEFAULT 0 NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`responses` text DEFAULT '{}' NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`assessment_updated_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL
);
