import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  sector: text("sector").notNull(),
  pathway: text("pathway").notNull(),
  intendedUse: text("intended_use").notNull(),
  programme: text("programme").notNull().default(""),
  annualMitigation: integer("annual_mitigation").notNull().default(0),
  description: text("description").notNull().default(""),
  responses: text("responses").notNull().default("{}"),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  assessmentUpdatedAt: text("assessment_updated_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  revision: integer("revision").notNull().default(1),
});
