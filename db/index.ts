import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getRawDb() {
  if (!env.DB) throw new Error("Project storage is unavailable");
  return env.DB;
}

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Configure the DB binding in wrangler.jsonc before using the application."
    );
  }

  return drizzle(env.DB, { schema });
}
