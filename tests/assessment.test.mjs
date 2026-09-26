import assert from 'node:assert/strict';
import test from 'node:test';
import {CRITERIA,demoProjects,evaluate,applicableCriteria,reportText} from '../lib/assessment.ts';

test('weights, pathway scope and reversal-risk applicability',()=>{
  const [cooking,solar,,forest]=demoProjects();
  assert.equal(CRITERIA.reduce((s,c)=>s+c.weight,0),100);
  assert(!applicableCriteria(solar).some(c=>c.id==='authorisation'));
  assert(applicableCriteria(cooking).some(c=>c.id==='authorisation'));
  assert(!applicableCriteria(forest).some(c=>c.id==='participation'));
  assert(applicableCriteria(forest).some(c=>c.id==='permanence'));
});
test('a high score cannot override an unresolved critical criterion',()=>{
  const p={...demoProjects()[0],responses:Object.fromEntries(CRITERIA.map(c=>[c.id,{rating:'documented',evidence:'Document reference and supporting evidence.'}]))};
  assert.equal(evaluate(p).score,100);
  assert.equal(evaluate(p).status,'Evidence ready');
  p.responses.authorisation={rating:'missing',evidence:''};
  assert(evaluate(p).score>=80);
  assert.notEqual(evaluate(p).status,'Evidence ready');
  p.responses.additionality={rating:'documented',evidence:''};
  assert(evaluate(p).criticalGaps.some(c=>c.id==='additionality'));
});
test('assessment completeness is separate from readiness',()=>{
  const p={...demoProjects()[0],responses:{}};
  assert.equal(evaluate(p).score,0);
  assert.equal(evaluate(p).status,'Not assessed');
  p.responses=Object.fromEntries(CRITERIA.map(c=>[c.id,{rating:'missing',evidence:''}]));
  assert.equal(evaluate(p).completeness,100);
  assert.equal(evaluate(p).score,0);
});
test('reports identify example evidence and include follow-up actions',()=>{
  const p=demoProjects()[0];
  assert(reportText(p).includes('FICTIONAL EXAMPLE PROJECT'));
  assert(reportText(p).includes('PRIORITISED ACTIONS'));
  assert(reportText(p).includes('authorisation'));
});
