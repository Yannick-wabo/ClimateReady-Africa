# ClimateReady Africa

Version 1.0.1 — public academic demonstration, 25 September 2026.

ClimateReady Africa connects a fictional mitigation-project profile to conditional readiness criteria, evidence notes, a transparent score, critical gaps and prioritised actions. Its outputs support preparation; they do not grant Article 6 authorisation, eligibility, registration or certification.

## Public demonstration behaviour

Four fictional templates are loaded from Cloudflare D1. Each visitor works on copies saved in their own browser. New projects, profile edits and assessment answers stay in that browser. Server creation and update endpoints always return HTTP 403. Reset affects only the current browser workspace. There are no application accounts or cross-device synchronisation. Clearing browser data removes local work; download text reports before resetting. Use fictional information only.

## Start locally

Use Node.js 22.13 or later, npm, and a current browser supporting Web Locks. Open the app through HTTPS or localhost.

```bash
npm ci
npm run db:migrate:local
npm run dev
```

Open the URL printed by Vite, normally http://localhost:5173.

## Verify

```bash
npm run check
npm run test:api
```

The first command runs lint, 15 unit tests, TypeScript checks and the production build. The second applies local migrations, starts a local server, checks four API outcomes and stops the server. It never uses a remote database. See [test evidence](docs/TESTING.md).

## Docker Compose

```bash
docker compose build
docker compose run --rm app npm run db:migrate:local
docker compose up
```

Open http://localhost:5173. Docker execution must still be confirmed on the submission machine.

## Publish and submit

Follow [deployment instructions](docs/DEPLOYMENT.md). The archive contains the source and GitHub Actions workflows; it is not an already published repository or deployment. Record real repository and application URLs before university submission. The submitted source ZIP must match the final public GitHub commit.

## Documentation

- [Consolidated academic report (PDF)](docs/ClimateReady_Africa_Phase3_Consolidated_Report.pdf)
- [Two-page making-of abstract (PDF)](docs/Wabo-Yannick_Aurelien_9218017_PSE_P3_S.pdf)
- [Installation and deployment (PDF)](docs/Installation_and_Deployment.pdf)
- [Executed check logs](docs/evidence/README.md)

- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATA-MODEL.md)
- [Assessment methodology](docs/ASSESSMENT-METHODOLOGY.md)
- [Testing](docs/TESTING.md)
- [Requirements traceability](docs/REQUIREMENTS-TRACEABILITY.md)
- [Release checklist](docs/GITHUB-EXPORT-CHECKLIST.md)
- [Security](SECURITY.md)

## Author and licence

Yannick Aurelien Wabo. MIT licence; see LICENSE. Third-party licence notices are retained.
