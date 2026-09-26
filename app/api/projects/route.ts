import {listProjects} from "@/db/projects";
export const dynamic="force-dynamic";
export async function GET() {
  try {return Response.json({projects:await listProjects()},{headers:{"Cache-Control":"no-store"}});}
  catch(error) {console.error("Example loading failed",error);return Response.json({error:"Examples could not be loaded. Please retry."},{status:503});}
}
// Visitors may read templates, but never create server-side records.
export async function POST() {
  return Response.json({error:"The public demonstration is read-only on the server. Save your work in this browser."},{status:403});
}
