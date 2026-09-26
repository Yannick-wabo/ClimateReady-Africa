# Public demonstration security

Use fictional information only. There are no user accounts, access-controlled personal records or confidential-data claims.

Version 1.0.1 rejects all POST /api/projects and PUT /api/projects/:id requests with HTTP 403. GET returns fictional templates only. Editable copies are stored locally in the visitor's browser. People sharing one browser profile share the same workspace. Other browser profiles cannot see these local copies through the application.

The browser validates inputs and serializes writes with Web Locks. These controls provide demonstration integrity, not protection against a person intentionally altering their own browser storage. A reset erases only the current browser's demonstration workspace after confirmation. Export reports before clearing local data.

Keep deployment tokens out of source, issue reports and screenshots. Store CLOUDFLARE_API_TOKEN in GitHub Actions secrets, scoped to the intended Cloudflare account. Report a suspected defect privately to the repository owner. A real-data service would require a new authentication, authorisation, privacy and backup design.
