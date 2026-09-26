import {z} from "zod";
import {applicableCriteria, type Project, type Profile} from "./assessment.ts";
import {profileSchema, answerSchema, updateSchema} from "./validation.ts";

export const WORKSPACE_KEY="climateready-africa:workspace:v1";
type Store=Pick<Storage,"getItem"|"setItem">;
const storedProject=z.object({
  id:z.string().min(1), responses:z.record(answerSchema), isDemo:z.boolean(),
  assessmentUpdatedAt:z.string().nullable(), createdAt:z.string(), updatedAt:z.string(),
  revision:z.number().int().positive(),
}).passthrough().refine(p=>profileSchema.safeParse(Object.fromEntries(
  ["name","country","sector","pathway","intendedUse","programme","annualMitigation","description"].map(k=>[k,p[k]])
)).success,"Invalid saved profile");
const workspaceSchema=z.object({version:z.literal(1),projects:z.array(storedProject).max(100)}).strict();
function persist(projects:Project[],store:Store) {
  if(projects.length>100)throw new Error("The demonstration supports up to 100 projects. Export your reports and reset this workspace to start again.");
  // The interface updates only after this synchronous write succeeds.
  store.setItem(WORKSPACE_KEY,JSON.stringify({version:1,projects}));
}
function existing(store:Store):Project[]|null {
  const raw=store.getItem(WORKSPACE_KEY);
  if(raw===null)return null;
  const parsed=workspaceSchema.safeParse(JSON.parse(raw));
  if(!parsed.success)throw new Error("Saved workspace data cannot be read. Reset only if you are ready to discard this browser's demonstration data.");
  return parsed.data.projects as Project[];
}
export function readWorkspace(templates:Project[],store:Store):Project[] {
  const saved=existing(store);
  if(saved!==null)return saved;
  const copies=structuredClone(templates.filter(p=>p.isDemo));
  persist(copies,store);return copies;
}
export function createLocalProject(input:Profile,store:Store):Project {
  const profile=profileSchema.parse(input),now=new Date().toISOString();
  const project:Project={...profile,id:crypto.randomUUID(),responses:{},isDemo:false,
    assessmentUpdatedAt:null,createdAt:now,updatedAt:now,revision:1};
  persist([project,...(existing(store)??[])],store);return project;
}
export function updateLocalProject(id:string,input:unknown,store:Store):Project {
  const data=updateSchema.parse(input),projects=existing(store)??[];
  const project=projects.find(p=>p.id===id);
  if(!project)throw new Error("This project no longer exists. Reload the workspace.");
  if(data.revision!==project.revision)throw new Error("This project changed in another tab. Your edits are preserved. Reload the page before saving again.");
  const now=new Date().toISOString();
  if(data.kind==="assessment") {
    const criteria=applicableCriteria(project);
    for(const c of criteria) {
      const answer=data.responses[c.id];
      if(answer?.rating==="documented"&&answer.evidence.trim().length<10)
        throw new Error(`Add a supporting reference or note for “${c.title}” (at least 10 characters).`);
    }
    project.responses=Object.fromEntries(criteria.filter(c=>data.responses[c.id]).map(c=>[c.id,data.responses[c.id]]));
    project.assessmentUpdatedAt=now;
  } else {
    const changed=(["country","sector","pathway","intendedUse"] as const).some(k=>project[k]!==data.profile[k]);
    Object.assign(project,data.profile);
    if(changed){project.responses={};project.assessmentUpdatedAt=null;}
  }
  project.updatedAt=now;project.revision++;
  persist(projects,store);return project;
}
export function resetWorkspace(templates:Project[],store:Store):Project[] {
  // Invalidate stale edits still open in another tab.
  const copies=structuredClone(templates.filter(p=>p.isDemo)).map(p=>({...p,revision:Date.now()}));
  persist(copies,store);return copies;
}
export async function withWorkspaceLock<T>(action:()=>T):Promise<T> {
  if(!navigator.locks)throw new Error("Saving requires a current browser on HTTPS or localhost with Web Locks support.");
  return navigator.locks.request(WORKSPACE_KEY,action);
}
