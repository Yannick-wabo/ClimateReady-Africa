import {getRawDb} from "./index";
import {demoProjects, type Project} from "@/lib/assessment";
export function fromRow(r:Record<string,unknown>):Project {
  return {id:String(r.id),name:String(r.name),country:String(r.country),sector:String(r.sector),pathway:r.pathway as Project["pathway"],intendedUse:r.intended_use as Project["intendedUse"],programme:String(r.programme),annualMitigation:Number(r.annual_mitigation),description:String(r.description),responses:JSON.parse(String(r.responses)),isDemo:!!r.is_demo,assessmentUpdatedAt:r.assessment_updated_at ? String(r.assessment_updated_at) : null,createdAt:String(r.created_at),updatedAt:String(r.updated_at),revision:Number(r.revision)};
}
export function insertStatement(p:Project) {
  return getRawDb().prepare("INSERT OR IGNORE INTO projects (id,name,country,sector,pathway,intended_use,programme,annual_mitigation,description,responses,is_demo,assessment_updated_at,created_at,updated_at,revision) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(p.id,p.name,p.country,p.sector,p.pathway,p.intendedUse,p.programme,p.annualMitigation,p.description,JSON.stringify(p.responses),p.isDemo?1:0,p.assessmentUpdatedAt,p.createdAt,p.updatedAt,p.revision);
}
export async function listProjects() {
  const db=getRawDb();
  // Ensure templates exist; never expose old visitor records.
  await db.batch(demoProjects().map(insertStatement));
  const result=await db.prepare("SELECT * FROM projects WHERE is_demo = 1 ORDER BY name ASC").all<Record<string,unknown>>();
  return result.results.map(fromRow);
}
