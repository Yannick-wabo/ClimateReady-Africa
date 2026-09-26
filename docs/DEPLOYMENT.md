# GitHub and Cloudflare deployment

## 1. Upload the source

Extract the code ZIP. Work in the directory containing package.json. Create an empty PUBLIC repository named climateready-africa in your GitHub account. Do not add another README, licence or .gitignore during repository creation.

```bash
git init
git branch -M main
git add .
git commit -m "Prepare ClimateReady Africa 1.0.1 academic demonstration"
git remote add origin https://github.com/YOUR-USERNAME/climateready-africa.git
git push -u origin main
```

Replace YOUR-USERNAME with your account name. Use GitHub's normal authentication or GitHub Desktop. Upload the extracted source tree, including .github/workflows. Do not upload only the ZIP. The included .gitignore excludes dependencies, generated builds, local database state and environment secrets.

## 2. Create the Cloudflare database

Install dependencies locally, then authenticate to your Cloudflare account and create D1:

```bash
npm ci
npx wrangler login
npm run db:create
```

Copy the returned database ID. Leave the placeholder in the committed wrangler.jsonc: the workflow replaces it on the temporary runner. Create a Cloudflare API token with Worker deployment and D1 edit permissions limited to your intended account. Do not share the token in chat or commit it.

## 3. Set repository secrets

Under repository Settings, Secrets and variables, Actions, add:

| Name | Value |
|---|---|
| CLOUDFLARE_ACCOUNT_ID | Your Cloudflare account ID |
| CLOUDFLARE_API_TOKEN | Restricted deployment token |
| CLOUDFLARE_D1_DATABASE_ID | Database ID returned above |

The IDs identify resources; the token authenticates deployment. They are not application login credentials.

## 4. Deploy

In Actions, select Deploy to Cloudflare and Run workflow from main. The workflow installs locked dependencies, configures the D1 binding, runs checks, applies remote migrations and deploys the Worker. Open the HTTPS address printed by Wrangler. No custom domain is required. Confirm the core workflow and read-only server controls in the hosted environment before recording the URL as verified.

## 5. Freeze and package

Finish corrections before final submission. Record the public repository URL, live application URL, final commit and successful workflow. Tag the reviewed commit, for example v1.0.1. Produce the source archive from that exact commit, and compare its file contents with the submitted code ZIP. If source or documentation in the repository changed after this prepared ZIP was created, regenerate the code ZIP. The university requires the repository and submitted source to remain identical and unchanged after submission.

## Docker Compose

```bash
docker compose build
docker compose run --rm app npm run db:migrate:local
docker compose up
```

Open http://localhost:5173. Use localhost, rather than an insecure remote HTTP address, for browser Web Locks. Cloudflare credentials are unnecessary for local emulation. The named volume preserves fictional D1 templates; visitor edits live in browser storage.

## Troubleshooting and rollback

A 503 from the examples API requires checking migration and DB binding. A missing-secret deployment error requires checking all three repository secrets. Server POST/PUT 403 is expected. A stale-save message requires reloading the page before reapplying edits. A storage/quota error does not indicate a successful save; export current work before resetting.

Cloudflare code rollback does not reverse D1 migrations. Keep the current schema for this release. Rehearse rollback before claiming the recovery target. Browser workspaces are not backed up by D1.

References checked 25 September 2026: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/ and https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
