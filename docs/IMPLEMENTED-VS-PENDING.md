# KnowFlow — Implemented vs Pending

> **This is the project handover log for developers and AI coding tools.** Update it after every meaningful implementation session so work can resume even if an AI tool runs out of credits or a session ends.

**Last reviewed:** 2026-11-08  
**Current baseline:** Repository code on `main` at the time this file was created.  
**Status rule:** A screen/demo interaction is not the same as a production integration. Keep those statuses separate.

## 1. Status legend

- [x] **Implemented (prototype):** Present in the repository and usable with demo/sample data.
- [ ] **Pending:** Not implemented yet, or not verified in the repository.
- [~] **In progress:** Work has started but is not complete.
- **Production-ready:** Use this label only after real services, security, persistence, error handling, and tests have been implemented and verified.

## 2. Implemented now

### Application foundation
- [x] React 19 + TypeScript application using TanStack Start.
- [x] File-based routing and shared application shell.
- [x] Responsive navigation with desktop sidebar and mobile navigation sheet.
- [x] Light/dark theme toggle.
- [x] Search UI for sample projects and people.
- [x] Shared UI components, dialogs, notifications, and charts.

### Roles and sign-in prototype
- [x] Four role categories: Outgoing Member, Incoming Member, Project Manager, Organisation Admin.
- [x] Demo team directory and role-to-user mapping.
- [x] Email/username lookup against sample people.
- [x] Demo password check (minimum length only); this is **not secure authentication**.
- [x] Demo Google sign-in flow; this is **not a real Google OAuth integration**.
- [x] Browser localStorage session persistence and sign-out.

### Workspace and handover prototype
- [x] Dashboard with project counts, sample progress, handover status, readiness indicators, and sample alerts.
- [x] Project list with progress and risk labels.
- [x] Team directory with role and status information.
- [x] Knowledge-source cards for GitHub, Jira, Confluence, Slack, Figma, and Google Drive.
- [x] AI-analysis screen with sample knowledge-gap findings.
- [x] Handover list and create-handover interaction.
- [x] Handover approval interaction and approval history in local app state.
- [x] Knowledge-verification and readiness views with sample readiness percentages.
- [x] Verification answer submission state in the app store.
- [x] Activity feed and settings preference UI.
- [x] Browser localStorage persistence for dashboard data, handovers, approvals, answers, and activity.

## 3. Pending — highest priority

### P0 — Production foundation
- [ ] Select and integrate a production authentication provider.
- [ ] Implement secure sessions, password handling, account recovery, and real Google OAuth if required.
- [~] Database foundation design documented in [DATABASE-DESIGN.md](./DATABASE-DESIGN.md); actual provider selection, provisioning, schema/migrations, and connection remain pending.
- [ ] Replace localStorage as the source of truth with server-side persistence.
- [ ] Enforce role-based access control on the server/API, not only in the UI.
- [ ] Add organisation and project data isolation.
- [ ] Add audit logs for important actions and permission changes.

### P1 — Real knowledge-source integrations
- [ ] Implement GitHub OAuth/app connection and repository selection.
- [ ] Fetch and process repository metadata, commits, pull requests, issues, README files, and selected documentation.
- [ ] Add Jira integration and issue/project ingestion.
- [ ] Add Confluence integration and page ingestion.
- [ ] Add Slack integration with explicit workspace and channel permissions.
- [ ] Add Figma integration for approved design files and decisions.
- [ ] Add Google Drive integration for approved documents.
- [ ] Show real sync status, last sync time, failures, and retry controls.
- [ ] Respect source permissions and provide disconnect/revoke controls.

### P1 — AI knowledge pipeline
- [ ] Build ingestion, parsing, chunking, indexing, and deduplication.
- [ ] Extract claims, decisions, architecture details, workflows, ownership, and dependencies.
- [ ] Store source references and citations for every extracted claim.
- [ ] Detect missing documentation, conflicting claims, stale knowledge, and single-person dependencies.
- [ ] Add evidence-grounded question answering with citations.
- [ ] Keep AI calls server-side through the selected AI provider; never expose secret keys in browser code.
- [ ] Add evaluation tests for extraction quality, answer correctness, citations, and uncertainty handling.

### P2 — Handover and verification completion
- [ ] Generate a structured handover draft from approved project sources.
- [ ] Let outgoing members edit, confirm, and submit handover sections.
- [ ] Add manager review comments, requested changes, approval/rejection, and audit history.
- [ ] Generate incoming-member questions from approved claims and source permissions.
- [ ] Support recall, reasoning, scenario, and uncertainty question types.
- [ ] Evaluate free-text answers against source-backed evidence.
- [ ] Provide explanations, citations, follow-up questions, and weak-area feedback.
- [ ] Update readiness scores from actual verification results rather than sample percentages.
- [ ] Give managers a readiness report showing gaps, evidence, and recommended next actions.

### P3 — Operational readiness
- [ ] Add loading, empty, error, and retry states for all live workflows.
- [ ] Add automated tests for role permissions, handover lifecycle, source ingestion, AI evaluation, and verification.
- [ ] Add observability, structured logs, and safe error reporting.
- [ ] Add deployment configuration, environment documentation, and backup/recovery plan.
- [ ] Review privacy, data retention, consent, and security before using real company data.

## 4. Current limitations — do not mistake these for completed features

| Area | Current reality |
| --- | --- |
| Authentication | Demo user lookup and password-length check; not secure production auth. |
| Google sign-in | Simulated flow; no verified OAuth connection. |
| Database | No production database is wired in the inspected application code. |
| Persistence | Browser localStorage; data is local to that browser/device. |
| Knowledge sources | Static sample source cards; no live connectors verified. |
| AI analysis | Sample findings in UI; no live ingestion or AI analysis verified. |
| Handover | Local prototype state; not yet a server-backed, auditable workflow. |
| Verification | UI and local answer state; no complete evidence-based grading pipeline verified. |
| Readiness | Sample percentages; not yet calculated from a production verification engine. |
| Permissions | Role metadata exists in the client; server-side enforcement is pending. |

## 5. Next build sequence

Follow this order unless a technical dependency requires a change:

1. **Production foundation:** database, authentication, organisation model, server-side permissions.
2. **One complete source integration:** start with GitHub; prove connect → fetch → store → cite → refresh.
3. **Knowledge pipeline:** extraction, source references, indexing, and gap detection.
4. **End-to-end handover:** draft → outgoing review → manager approval.
5. **Incoming verification:** source-backed questions → answer evaluation → feedback.
6. **Readiness reporting:** calculate readiness from verified evidence and expose manager actions.
7. **Expand integrations:** Jira, Confluence, Slack, Figma, and Drive.
8. **Hardening:** security, tests, monitoring, deployment, and documentation.

## 6. AI coding tool handoff protocol — READ THIS BEFORE AND AFTER EVERY SESSION

### Before starting work
1. Read this file completely.
2. Read [PROJECT OVERVIEW](./OVERVIEW.md).
3. Inspect the relevant source files and the latest Git history.
4. Check whether another session has already changed the same files.
5. Pick one small, clearly scoped task from the pending list.

### While implementing
1. Work in small, reviewable changes.
2. Do not mark a task complete just because a page or button exists.
3. For integrations, verify a real end-to-end request and its failure path.
4. Add or update tests where practical.
5. Preserve existing working UI and follow `AGENTS.md`, especially its guidance on secrets, generated files, and server-only operations.

### Before ending, switching tools, or running out of credits
1. Update the status checkbox for every task changed in this session.
2. Add a dated entry to the session log below.
3. Record exact files changed and important implementation decisions.
4. Record commands/tests run and whether they passed. Never claim tests passed if they were not run.
5. Write the **very next action** so another AI tool can continue without guessing.
6. Commit/push the code and this tracker together when appropriate.

### Required session update format

Copy this template into the session log after each build session:

```md
### YYYY-MM-DD — Short task name
- **Completed:** What is now implemented and verified.
- **Still pending:** What remains unfinished.
- **Files changed:** Exact repository paths.
- **Checks:** Commands run and results (or "not run").
- **Decisions / blockers:** Important context, errors, credentials needed (never paste secrets).
- **Next action:** The single most useful next task.
```

## 7. Session log

### 2026-11-08 — Remove Lovable-specific tooling and telemetry
- **Completed:** Replaced the Lovable Vite wrapper with the standard Vite + TanStack Start + React + Tailwind + Nitro configuration; removed the Lovable-only dev dependency and project metadata; removed editor-specific error telemetry; kept the existing app error boundary and server error handling; replaced the generated Lovable-specific repository instructions with neutral project guidance.
- **Still pending:** Build, lint, tests, and local runtime validation have not been run in this session. The database remains a design only; no provider has been selected or connected.
- **Files changed:** `vite.config.ts`, `package.json`, `package-lock.json`, `src/routes/__root.tsx`, `src/lib/lovable-error-reporting.ts` (deleted), `.lovable/project.json` (deleted), `AGENTS.md`, `docs/DATABASE-DESIGN.md`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** GitHub source edits only; no local install/build/lint/test was available. Confirmed the Lovable-specific package and metadata references were removed from the files edited.
- **Decisions / blockers:** Existing KnowFlow screens, routes, stores, and demo workflows were left unchanged. The Vite config now uses the framework's standard plugins; runtime/build validation is still required before considering the removal fully verified.
- **Next action:** Clone/pull `main`, run `npm ci`, `npm run build`, `npm run lint`, and `npm test`; fix any configuration issues before selecting a database provider.

### 2026-11-08 — Database foundation design prepared
- **Completed:** Inspected `AGENTS.md`, the package manifest, project metadata, and the current auth/data stores. Added `docs/DATABASE-DESIGN.md` with the proposed tenant-aware relational model, relationships, security/RLS requirements, indexes, migration sequence, and acceptance criteria.
- **Still pending:** No database was provisioned or connected. At that time, repository instructions prohibited hand-editing database migrations and required changes through the connected platform workflow. Provider confirmation, schema creation, RLS policies, generated types, and server-side persistence were not completed. The current app remains localStorage/demo-backed.
- **Files changed:** `docs/DATABASE-DESIGN.md`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** GitHub source inspection only; build, lint, and tests not run. Documentation write confirmed by GitHub commit response.
- **Decisions / blockers:** Do not create database migrations or select a provider by assumption. Select a database provider and apply the schema using its supported migration workflow. No application UI or runtime code was changed.
- **Next action:** Select and provision a managed database, implement the schema in `docs/DATABASE-DESIGN.md`, and configure tenant/project RLS. Then verify cross-organisation access denial before wiring the frontend.

### 2026-11-08 — Documentation baseline created
- **Completed:** Inspected the current repository structure, package dependencies, route modules, role/auth store, sample data, dashboard, section views, and local app data store. Created this tracker and the project overview.
- **Still pending:** All production integrations and backend work listed above remain pending unless separately verified in code.
- **Files changed:** `docs/OVERVIEW.md`, `docs/IMPLEMENTED-VS-PENDING.md`, `README.md`.
- **Checks:** Repository source inspection only. Build, lint, and tests were not run.
- **Decisions / blockers:** Existing screens and interactions are classified as prototype-level where they use sample data or localStorage. No live source connector, production database, secure authentication, or live AI pipeline was verified.
- **Next action:** Choose the production backend/auth/database approach, then implement the smallest end-to-end foundation slice.

---

**Rule:** Every AI coding tool that changes this project must update this tracker in the same session. If work is incomplete, mark it as in progress or pending and leave a precise next action.
