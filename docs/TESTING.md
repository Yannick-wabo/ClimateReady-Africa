# Tests and evidence

## Executed on 25 September 2026

- 15 Node unit tests passed: seven existing domain/validation tests and eight workspace regression tests (UT-08–UT-15).
- Lint and TypeScript checks passed.
- The production build exited successfully, and a Wrangler deployment dry run bundled the Worker and 12 client assets successfully. This did not publish the application.
- Four local HTTP checks passed: API-01 returns four fictional examples; API-02 rejects anonymous creation with 403; API-03 rejects direct anonymous update with 403; API-04 confirms templates unchanged.
- Local D1 migration passed.

Run npm run check and npm run test:api. Exact logs accompany the submission. Dependencies for this review reused the prior locked installation after offline npm ci could not retrieve one uncached package. This is not evidence of a fresh internet-connected installation.

The workspace tests use independent in-memory Storage-compatible stores. They verify copy isolation, reopen persistence, scope reset, stale conflicts, short-evidence rejection, local reset, failed persistence and corrupt-data handling. They do not substitute for a browser acceptance session.

## Release observations still required

Use the deployed application to create a fictional project, save/reopen an assessment, export its text report, confirm independent-browser isolation and confirm reset. Observe keyboard access, 200% zoom and 360 px width. Record actual results rather than marking unexecuted checks passed. The specified hosted performance, 60-minute maintenance and 60-minute rollback targets remain unmeasured. Docker and production Cloudflare operation have not been verified in this review.
