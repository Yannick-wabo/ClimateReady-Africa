# Data model

D1 retains the projects table defined in db/schema.ts and the SQL migration. It supplies fictional templates only. The read API filters is_demo = 1, including when older non-demo rows exist. No visitor mutation reaches D1 in version 1.0.1.

The browser stores a JSON envelope with version = 1 and a projects array under climateready-africa:workspace:v1. A project contains its identifier, profile, criterion-response map, example flag, revision and timestamps. At most 100 projects are retained. A save accepts at most 14 responses, validates evidence length and filters out inapplicable criteria. Scores and actions are derived, not independently persisted.

Changing country, sector, pathway or intended use clears saved responses. Each accepted edit increments revision. Web Locks plus revision checks prevent stale tab updates from silently replacing newer data. Browser storage is not an authenticated multi-user database or a backup service. The schema version is separate from rubric version 1.0; rubric migration/history remains technical debt.
