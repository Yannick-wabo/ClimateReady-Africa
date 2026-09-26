import assert from "node:assert/strict";
import test from "node:test";
import { profileSchema } from "../lib/validation.ts";

const valid = {
  name: "Community solar mini-grids",
  country: "Senegal",
  sector: "Renewable energy",
  pathway: "pacm",
  intendedUse: "contribution",
  programme: "Paris Agreement Crediting Mechanism",
  annualMitigation: 28000,
  description: "Fictional project used for validation testing.",
};

test("a valid project profile is accepted", () => {
  assert.equal(profileSchema.safeParse(valid).success, true);
});

test("Article 6.2 requires authorised international use", () => {
  const result = profileSchema.safeParse({
    ...valid,
    pathway: "a62",
    intendedUse: "contribution",
  });
  assert.equal(result.success, false);
});

test("unknown countries and negative mitigation estimates are rejected", () => {
  assert.equal(profileSchema.safeParse({ ...valid, country: "Unknown" }).success, false);
  assert.equal(profileSchema.safeParse({ ...valid, annualMitigation: -1 }).success, false);
});
