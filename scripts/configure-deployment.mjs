import { readFile, writeFile } from "node:fs/promises";

const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
if (!databaseId) {
  throw new Error("CLOUDFLARE_D1_DATABASE_ID is required for deployment.");
}
if (!/^[0-9a-f-]{36}$/i.test(databaseId)) {
  throw new Error("CLOUDFLARE_D1_DATABASE_ID is not a valid database identifier.");
}

const file = new URL("../wrangler.jsonc", import.meta.url);
const source = await readFile(file, "utf8");
const placeholder = "00000000-0000-4000-8000-000000000000";
if (!source.includes(placeholder)) {
  throw new Error("The database placeholder was not found in wrangler.jsonc.");
}
await writeFile(file, source.replace(placeholder, databaseId), "utf8");
console.log("Deployment configuration prepared.");
