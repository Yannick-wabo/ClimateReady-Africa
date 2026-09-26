# Architecture

The browser interface in app/page.tsx uses pure assessment functions in lib/assessment.ts and validation in lib/validation.ts. The local workspace module handles validated creation, scope changes, evidence saves, stale revisions and reset. Browser Web Locks serialize same-origin writes across tabs; localStorage retains one versioned workspace containing up to 100 fictional projects. Persistence errors are surfaced before success is displayed.

The Cloudflare Worker serves the application and GET /api/projects. The repository in db/projects.ts seeds four fictional templates and selects only rows marked is_demo. POST and PUT endpoints return 403 unconditionally. Visitors cannot create or update shared D1 rows through this API. The route structure uses Vinext/Vite with Next-compatible interfaces; it is not a separately deployed Next.js Node server.

Local copies retain an example label. Editing them changes neither the template nor another browser. The reset dialog requires confirmation, restores templates and changes revisions to invalidate open stale edits. Data is not encrypted by the application; it is fictional demonstration material. Distinct browser profiles have distinct workspaces; people sharing one profile share that workspace.

The consolidated Phase 3 report supplies a UML use-case diagram for scope, a UML component diagram for dependencies and a UML class diagram for the logical aggregate. Dependencies in the component view are static client-to-supplier relationships, not network data-flow arrows.
