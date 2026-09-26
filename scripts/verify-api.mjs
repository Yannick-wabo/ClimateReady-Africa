import {spawn,spawnSync} from "node:child_process";
import assert from "node:assert/strict";
const migration=spawnSync(process.execPath,["node_modules/wrangler/bin/wrangler.js","d1","migrations","apply","climateready-africa","--local"],{stdio:"inherit"});
if(migration.status!==0)process.exit(migration.status??1);
const port=Number(process.env.TEST_PORT??5182),base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port",String(port),"--strictPort"],{stdio:["ignore","ignore","pipe"]});
let errors="";server.stderr.on("data",d=>errors+=d);
try {
 let response;
 for(let i=0;i<80;i++){
   try {response=await fetch(`${base}/api/projects`);break;}catch{}
   if(server.exitCode!==null)throw new Error(errors||"Local server stopped");
   await new Promise(r=>setTimeout(r,250));
 }
 assert.ok(response,"Server starts within 20 seconds");assert.equal(response.status,200);
 const before=await response.json();assert.equal(before.projects.length,4);assert.ok(before.projects.every(p=>p.isDemo));
 console.log("API-01 PASS: four fictional templates returned");
 const post=await fetch(`${base}/api/projects`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:"Anonymous write"})});
 assert.equal(post.status,403);console.log("API-02 PASS: anonymous creation rejected with 403");
 const put=await fetch(`${base}/api/projects/${before.projects[0].id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:"assessment",revision:before.projects[0].revision,responses:{}})});
 assert.equal(put.status,403);console.log("API-03 PASS: direct anonymous update rejected with 403");
 assert.deepEqual(await (await fetch(`${base}/api/projects`)).json(),before);
 console.log("API-04 PASS: shared templates unchanged after write attempts");
 console.log("RESULT: 4/4 local HTTP checks passed");
}catch(error){console.error(error);process.exitCode=1;}
finally{server.kill("SIGTERM");}
