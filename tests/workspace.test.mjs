import test from "node:test";
import assert from "node:assert/strict";
import {demoProjects,applicableCriteria} from "../lib/assessment.ts";
import {WORKSPACE_KEY,readWorkspace,createLocalProject,updateLocalProject,resetWorkspace} from "../lib/local-workspace.ts";
const store=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}};
const profile=p=>Object.fromEntries(["name","country","sector","pathway","intendedUse","programme","annualMitigation","description"].map(k=>[k,p[k]]));

test("UT-08 template edits cannot mutate the shared input",()=>{
 const templates=demoProjects(),s=store(),copies=readWorkspace(templates,s);
 copies[0].name="Changed locally";
 assert.notEqual(templates[0].name,copies[0].name);
 assert.equal(readWorkspace(templates,s)[0].name,templates[0].name);
});
test("UT-09 creation survives reopening and remains isolated from a second browser",()=>{
 const a=store(),b=store(),templates=demoProjects();readWorkspace(templates,a);readWorkspace(templates,b);
 const p=createLocalProject({...profile(templates[0]),name:"Fictional isolation test"},a);
 assert.equal(readWorkspace(templates,a).find(x=>x.id===p.id).name,p.name);
 assert.equal(readWorkspace(templates,b).some(x=>x.id===p.id),false);
});
test("UT-10 changing assessment scope clears previous answers",()=>{
 const s=store(),p=readWorkspace(demoProjects(),s)[0];
 const next=updateLocalProject(p.id,{kind:"profile",revision:p.revision,profile:{...profile(p),country:p.country==="Senegal"?"Ghana":"Senegal"}},s);
 assert.deepEqual(next.responses,{});assert.equal(next.assessmentUpdatedAt,null);
});
test("UT-11 stale updates preserve the newer saved value",()=>{
 const s=store(),p=readWorkspace(demoProjects(),s)[0];
 updateLocalProject(p.id,{kind:"profile",revision:p.revision,profile:{...profile(p),name:"Newer saved name"}},s);
 assert.throws(()=>updateLocalProject(p.id,{kind:"profile",revision:p.revision,profile:profile(p)},s),/another tab/);
 assert.equal(readWorkspace([],s)[0].name,"Newer saved name");
});
test("UT-12 short documented evidence is rejected without changing saved data",()=>{
 const s=store(),p=readWorkspace(demoProjects(),s)[0],before=s.getItem(WORKSPACE_KEY);
 const id=applicableCriteria(p)[0].id;
 assert.throws(()=>updateLocalProject(p.id,{kind:"assessment",revision:p.revision,responses:{[id]:{rating:"documented",evidence:"short"}}},s),/10 characters/);
 assert.equal(s.getItem(WORKSPACE_KEY),before);
});
test("UT-13 reset affects only one store and invalidates stale revisions",()=>{
 const a=store(),b=store(),templates=demoProjects(),p=readWorkspace(templates,a)[0];readWorkspace(templates,b);
 const beforeB=b.getItem(WORKSPACE_KEY);
 createLocalProject(profile(p),a);const reset=resetWorkspace(templates,a);
 assert.equal(reset.length,4);assert.equal(b.getItem(WORKSPACE_KEY),beforeB);
 assert.throws(()=>updateLocalProject(p.id,{kind:"profile",revision:p.revision,profile:profile(p)},a),/another tab/);
});
test("UT-14 a quota failure cannot report a successful save",()=>{
 const backing=store(),p=readWorkspace(demoProjects(),backing)[0],before=backing.getItem(WORKSPACE_KEY);
 const full={getItem:backing.getItem,setItem:()=>{throw new Error("Storage quota exceeded")}};
 assert.throws(()=>createLocalProject(profile(p),full),/quota/);
 assert.equal(backing.getItem(WORKSPACE_KEY),before);
});
test("UT-15 corrupt saved data is not silently overwritten",()=>{
 const s=store();s.setItem(WORKSPACE_KEY,'{"version":99,"projects":[]}');
 assert.throws(()=>readWorkspace(demoProjects(),s),/cannot be read/);
 assert.equal(s.getItem(WORKSPACE_KEY),'{"version":99,"projects":[]}');
});
