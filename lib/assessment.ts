export type Pathway = "pacm" | "a62" | "independent";
export type Rating = "missing" | "partial" | "documented";
export type Answer = { rating: Rating | null; evidence: string };
export type Responses = Record<string, Answer>;
export type Project = {
  id: string; name: string; country: string; sector: string; pathway: Pathway;
  intendedUse: "authorised" | "contribution"; programme: string;
  annualMitigation: number; description: string; responses: Responses;
  isDemo: boolean; assessmentUpdatedAt: string | null;
  createdAt: string; updatedAt: string; revision: number;
};
export type Profile = Pick<Project, "name" | "country" | "sector" | "pathway" | "intendedUse" | "programme" | "annualMitigation" | "description">;
export type Criterion = {
  id: string; group: string; title: string; question: string; evidence: string;
  action: string; owner: string; weight: number; critical?: boolean;
  applies?: (p: Project | Profile) => boolean;
};
export const PATHWAYS: Record<Pathway, string> = { pacm: "Article 6.4 / PACM", a62: "Article 6.2", independent: "Independent crediting" };
export const SECTORS = ["Clean cooking", "Renewable energy", "Waste", "Forestry & land use", "Biochar", "Transport", "Industry", "Other"];
export const COUNTRIES = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo", "Côte d’Ivoire", "Democratic Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Togo", "Tunisia", "Uganda", "United Republic of Tanzania", "Zambia", "Zimbabwe"];
export const GROUPS = [
  { id: "policy", name: "Policy & eligibility", detail: "Host-country conditions and NDC alignment" },
  { id: "integrity", name: "Carbon integrity", detail: "Additionality, quantification and tracking" },
  { id: "mrv", name: "MRV & verification", detail: "Monitoring, reporting and independent assurance" },
  { id: "people", name: "People & safeguards", detail: "Rights, consultation and sustainable development" },
  { id: "market", name: "Market pathway", detail: "Approvals, authorisation and accounting" },
];
export const needsAuthorisation = (p: Project | Profile) => p.pathway === "a62" || p.intendedUse === "authorised";
export const CRITERIA: Criterion[] = [
  { id: "ndc", group: "policy", title: "NDC alignment", weight: 8,
    question: "Is the project’s relationship to the host country’s climate targets and sector priorities documented?",
    evidence: "Name the NDC version, relevant target or measure, project contribution and any national eligibility restrictions.",
    action: "Map the activity to the current NDC and confirm national sector eligibility with the relevant authority.", owner: "Project developer / climate authority" },
  { id: "participation", group: "policy", title: "Host-country participation", weight: 5,
    question: "Have the applicable host-country participation requirements and responsible authority been checked?",
    evidence: "Reference the designated authority and applicable participation arrangements. A national framework alone does not prove that all requirements are met.",
    action: "Confirm the applicable Party participation requirements and the national point of contact for the selected pathway.", owner: "National Article 6 authority", applies: p => p.pathway !== "independent" || needsAuthorisation(p) },
  { id: "additionality", group: "integrity", title: "Additionality", weight: 12, critical: true,
    question: "Does the evidence demonstrate that the mitigation would not occur without the relevant carbon-credit incentive?",
    evidence: "Reference the applicable additionality test, legal requirements, investment or barrier analysis and supporting assumptions.",
    action: "Complete the applicable additionality demonstration and retain its underlying evidence.", owner: "Project developer / technical adviser" },
  { id: "methodology", group: "integrity", title: "Methodology & baseline", weight: 12, critical: true,
    question: "Is an eligible methodology identified, with a conservative baseline and documented applicability?",
    evidence: "Provide the methodology identifier, version, approval status and applicability assessment. A CDM or independent methodology is not automatically a PACM methodology.",
    action: "Confirm methodology eligibility and document the baseline, boundaries, leakage and uncertainty treatment.", owner: "Methodology specialist" },
  { id: "permanence", group: "integrity", title: "Reversal risk & permanence", weight: 6,
    question: "Are reversal risks assessed and appropriate monitoring, liability and compensation arrangements defined?",
    evidence: "Reference the storage or land-management risk assessment and the selected mechanism’s reversal provisions.",
    action: "Document permanence, reversal monitoring and measures to address and compensate potential reversals.", owner: "Project developer / risk specialist", applies: p => ["Forestry & land use", "Biochar", "Other"].includes(p.sector) },
  { id: "tracking", group: "integrity", title: "Avoidance of double counting", weight: 8, critical: true,
    question: "Are controls in place to avoid duplicate issuance, use and claims for the same mitigation?",
    evidence: "Identify registries, unique activity identifiers, overlap checks and ownership/claim controls. Record corresponding adjustments separately when applicable.",
    action: "Define registry and claim controls and check for overlaps with other programmes or activities.", owner: "Project developer / registry operator" },
  { id: "mrv", group: "mrv", title: "Monitoring & reporting plan", weight: 10,
    question: "Does the project have an implementable monitoring, reporting and quality-control plan?",
    evidence: "Reference parameters, methods, monitoring frequency, responsibilities, QA/QC, uncertainty and record retention.",
    action: "Complete the monitoring plan, data responsibilities and quality assurance/quality control procedures.", owner: "Project MRV team" },
  { id: "validation", group: "mrv", title: "Independent validation & verification", weight: 7,
    question: "Are arrangements in place for independent validation and subsequent verification under the chosen pathway?",
    evidence: "Identify the required independent body, its relevant accreditation or approval, the scope and proposed schedule.",
    action: "Confirm an eligible independent validation/verification body and prepare the design document and assurance schedule.", owner: "Project developer / independent body" },
  { id: "safeguards", group: "people", title: "Environmental & social safeguards", weight: 7, critical: true,
    question: "Have environmental and social risks been assessed and mitigation and grievance arrangements documented?",
    evidence: "Reference the safeguards assessment, mitigation measures, grievance process and applicable sustainable development requirements.",
    action: "Complete the safeguards assessment and establish mitigation, monitoring and grievance arrangements.", owner: "Safeguards specialist" },
  { id: "consultation", group: "people", title: "Stakeholder participation", weight: 6,
    question: "Have relevant stakeholders been consulted and their concerns addressed?",
    evidence: "Reference consultation records, responses to concerns, accessibility measures and consent where required.",
    action: "Document meaningful consultation, responses to comments and any required free, prior and informed consent.", owner: "Community liaison / project developer" },
  { id: "rights", group: "people", title: "Rights & benefit sharing", weight: 5, critical: true,
    question: "Are land, resource and carbon-related rights and benefit-sharing arrangements clear?",
    evidence: "Reference applicable rights, participant agreements and transparent benefit-sharing arrangements, including unresolved disputes.",
    action: "Resolve rights and ownership issues and document applicable benefit-sharing arrangements.", owner: "Project developer / legal adviser" },
  { id: "approval", group: "market", title: "Project approval", weight: 5, critical: true,
    question: "Are the relevant host-country project approvals and permissions documented?",
    evidence: "For PACM, identify host Party approval and activity-participant authorisation. Record authorisation of the use of units separately.",
    action: "Obtain or document the required project approvals; for PACM, distinguish these from authorisation of the use of A6.4ERs.", owner: "Project developer / national authority" },
  { id: "authorisation", group: "market", title: "Authorisation for international use", weight: 5, critical: true,
    question: "Are the applicable authorisation arrangements for the approach and use of mitigation outcomes documented?",
    evidence: "Specify the relevant Party authorisations, covered activity/approach, uses, scope, vintages and conditions. A letter of no objection is not automatically an authorisation.",
    action: "Confirm the required authorisations for the cooperative approach and/or use of outcomes, with their scope and conditions.", owner: "Participating Party authorities", applies: needsAuthorisation },
  { id: "accounting", group: "market", title: "Corresponding adjustments & reporting", weight: 4, critical: true,
    question: "Are Party arrangements for first transfer, corresponding adjustments, tracking and reporting identified?",
    evidence: "Reference the applicable arrangements and responsibilities. The host Party applies the accounting adjustment; the developer supplies required project data.",
    action: "Clarify first-transfer conditions and Party responsibilities for corresponding adjustments and Article 6 reporting.", owner: "Participating Party authorities", applies: needsAuthorisation },
];
export const SOURCE_LINKS = [
  { title: "UNFCCC · Article 6.4 rules and regulations", url: "https://unfccc.int/process-and-meetings/bodies/constituted-bodies/article-64-supervisory-body/rules-and-regulations", detail: "Mechanism standards, procedures, forms and decisions" },
  { title: "UNFCCC · Cooperative implementation under Article 6.2", url: "https://unfccc.int/process-and-meetings/the-paris-agreement/cooperative-implementation", detail: "Guidance on cooperative approaches, accounting and reporting" },
  { title: "ICVCM · Core Carbon Principles", url: "https://icvcm.org/core-carbon-principles/", detail: "Integrity principles for carbon-crediting programmes and credit categories" },
];
export function applicableCriteria(p: Project | Profile) { return CRITERIA.filter(c => !c.applies || c.applies(p)); }
export function answerValue(a?: Answer) { return a?.rating === "documented" && a.evidence.trim().length >= 10 ? 1 : a?.rating === "partial" ? 0.5 : 0; }
export function evaluate(p: Project) {
  const criteria = applicableCriteria(p);
  const weight = criteria.reduce((s,c) => s+c.weight,0);
  const points = criteria.reduce((s,c) => s+c.weight*answerValue(p.responses[c.id]),0);
  const answered = criteria.filter(c => p.responses[c.id]?.rating).length;
  const score = Math.round(points / weight * 100);
  const criticalGaps = criteria.filter(c => c.critical && answerValue(p.responses[c.id]) < 1);
  const gaps = criteria.filter(c => answerValue(p.responses[c.id]) < 1).sort((a,b) => Number(!!b.critical)-Number(!!a.critical) || b.weight-a.weight);
  const status = answered === 0 ? "Not assessed" : score >= 80 && criticalGaps.length === 0 && answered === criteria.length ? "Evidence ready" : score >= 50 ? "Needs work" : "Early stage";
  const tone = status === "Evidence ready" ? "green" : status === "Not assessed" ? "neutral" : status === "Needs work" ? "amber" : "blue";
  const groups = GROUPS.map(g => {
    const items = criteria.filter(c => c.group === g.id);
    return {...g, items, score: Math.round(items.reduce((s,c) => s+c.weight*answerValue(p.responses[c.id]),0) / items.reduce((s,c) => s+c.weight,0)*100)};
  });
  return {criteria, weight, score, answered, total: criteria.length, completeness: Math.round(answered/criteria.length*100), criticalGaps, gaps, status, tone, groups};
}
export const RATING_LABELS: Record<Rating, string> = {missing:"Not yet",partial:"In progress",documented:"Documented"};
export function demoProjects(): Project[] {
  const profiles: (Profile & {id:string; levels:string})[] = [
    { id:"example-cooking",name:"Community clean cooking",country:"Ghana",sector:"Clean cooking",pathway:"a62",intendedUse:"authorised",programme:"Independent programme under consideration",annualMitigation:62000,description:"Illustrative programme to replace inefficient biomass cooking with cleaner household technologies. This example connects technical evidence with Article 6 authorisation and accounting questions.",levels:"ddddddd pddpppp".replaceAll(" ","") },
    { id:"example-solar",name:"Rural solar mini-grids",country:"Senegal",sector:"Renewable energy",pathway:"pacm",intendedUse:"contribution",programme:"Paris Agreement Crediting Mechanism",annualMitigation:28000,description:"Illustrative electricity-access project using solar mini-grids. Intended unit use is mitigation contribution; authorisation for international use is outside this screening scope.",levels:"dddddddpdpdddd" },
    { id:"example-waste",name:"Landfill methane recovery",country:"Cameroon",sector:"Waste",pathway:"pacm",intendedUse:"authorised",programme:"Paris Agreement Crediting Mechanism",annualMitigation:94000,description:"Illustrative waste-sector activity to capture and use landfill gas. The concept requires further methodology, safeguards and host-country approval work.",levels:"dpdpmpdpmpmmpm" },
    { id:"example-forest",name:"Community agroforestry",country:"Togo",sector:"Forestry & land use",pathway:"independent",intendedUse:"contribution",programme:"Independent programme to be selected",annualMitigation:18000,description:"Illustrative agroforestry project linking restoration, farmer livelihoods and removals. Rights, benefit sharing, permanence and monitoring need further development.",levels:"pmpmpmpdpmpmmm" },
  ];
  return profiles.map(({levels,...p}) => {
    const responses:Responses={};
    CRITERIA.forEach((c,i) => {
      const rating = levels[i] === "d" ? "documented" : levels[i] === "p" ? "partial" : "missing";
      responses[c.id]={rating,evidence:rating === "documented" ? `Illustrative evidence only: a sample ${c.title.toLowerCase()} record is assumed available for this fictional project. No real document or approval has been verified.` : rating === "partial" ? `Illustrative work in progress: the ${c.title.toLowerCase()} record is being prepared.` : ""};
    });
    return {...p,responses,isDemo:true,assessmentUpdatedAt:"2026-09-05T09:00:00.000Z",createdAt:"2026-09-05T09:00:00.000Z",updatedAt:"2026-09-05T09:00:00.000Z",revision:1};
  });
}
export function reportText(p:Project) {
  const e=evaluate(p);
  return ["CLIMATEREADY AFRICA","Article 6 Readiness Assessment and Decision-Support System","",p.isDemo?"FICTIONAL EXAMPLE PROJECT":"PROJECT READINESS REPORT",`Project: ${p.name}`,`Country: ${p.country}`,`Sector: ${p.sector}`,`Pathway: ${PATHWAYS[p.pathway]}`,`Intended use: ${needsAuthorisation(p)?"Authorised international use":"Mitigation contribution / no Article 6 authorisation sought"}`,`Programme: ${p.programme||"Not specified"}`,`Estimated annual mitigation: ${p.annualMitigation.toLocaleString("en-GB")} tCO2e (estimate, not issued credits)`,`Generated: ${new Date().toISOString()}`,`Assessment last saved: ${p.assessmentUpdatedAt||"Not yet saved"}`,"",p.description,"",`Readiness: ${e.score}/100 — ${e.status}`,`Assessment completeness: ${e.answered}/${e.total}`,`Unresolved critical criteria: ${e.criticalGaps.length}`,"","ASSESSMENT",...e.criteria.flatMap(c=>[`${c.title} (weight ${c.weight}/${e.weight}): ${p.responses[c.id]?.rating?RATING_LABELS[p.responses[c.id].rating!]:"Not assessed"}`,`Evidence / notes: ${p.responses[c.id]?.evidence||"None provided"}`,""]),"PRIORITISED ACTIONS",...e.gaps.map((c,i)=>`${i+1}. ${c.critical?"[Critical] ":""}${c.action} Responsible: ${c.owner}.`),"","SCORING","ClimateReady Africa screening rubric v1.0. Not yet / unanswered = 0; in progress = 0.5; documented with a supporting reference or note = 1. Score = 100 × sum(weight × value) / applicable weight. Inapplicable criteria are excluded. Evidence ready requires at least 80/100, every applicable criterion assessed, and all critical criteria documented. Weights and thresholds are product design choices, not UNFCCC or ICVCM ratings.","","Readiness screening only. Evidence is self-reported and has not been independently verified. This report does not confer approval, eligibility, registration, credit certification or an ICVCM label. Check national and mechanism-specific requirements at the time of application.","","REFERENCES",...SOURCE_LINKS.map(s=>`${s.title}: ${s.url}`)].join("\n");
}
