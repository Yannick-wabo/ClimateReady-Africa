import {z} from "zod";
import {COUNTRIES,SECTORS} from "./assessment.ts";
export const profileSchema=z.object({
  name:z.string().trim().min(3,"Enter a project name of at least 3 characters.").max(120),
  country:z.string().refine(v=>COUNTRIES.includes(v),"Choose a host country."),
  sector:z.string().refine(v=>SECTORS.includes(v),"Choose a sector."),
  pathway:z.enum(["pacm","a62","independent"]),
  intendedUse:z.enum(["authorised","contribution"]),
  programme:z.string().trim().max(180),
  annualMitigation:z.number().int().min(0).max(1000000000),
  description:z.string().trim().max(3000),
}).strict().refine(p=>p.pathway!=="a62" || p.intendedUse==="authorised","Article 6.2 requires authorised international use in this screening.");
export const answerSchema=z.object({rating:z.enum(["missing","partial","documented"]).nullable(),evidence:z.string().max(5000)}).strict();
export const updateSchema=z.discriminatedUnion("kind",[
  z.object({kind:z.literal("profile"),revision:z.number().int().positive(),profile:profileSchema}).strict(),
  z.object({kind:z.literal("assessment"),revision:z.number().int().positive(),responses:z.record(answerSchema).refine(r=>Object.keys(r).length<=14)}).strict(),
]);
export function rejectCrossSite(request:Request) {
  return request.headers.get("sec-fetch-site")==="cross-site";
}
