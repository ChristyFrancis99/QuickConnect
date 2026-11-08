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
- [x] Dashboard welcome message reflects the currently selected demo user.
- [x] Handover approval history and approval activity record the active demo user.
- [x] Dashboard with project counts, sample progress, handover status, readiness indicators, and sample alerts.
- [x] Project list with progress and risk labels.
- [x] Team directory with role and status information.
- [x] Knowledge-source cards for GitHub, Jira, Confluence, Slack, Figma, and Google Drive.
- [x] Frontend demo controls to connect/disconnect sample sources, simulate a refresh, show last demo refresh time, and record source actions in local activity history (no external service calls).
- [x] AI-analysis screen with sample knowledge-gap findings.
- [x] Handover list and create-handover interaction.
- [x] Handover approval interaction and approval history in local app state.
- [x] Knowledge-verification and readiness views with sample readiness percentages.
- [x] Incoming-member verification progress by approved handover, saved-answer history, and completion states (frontend prototype; no AI grading).
- [x] Verification answer submission state in the app store.
- [x] Manager review of submitted answers, manual knowledge-gap flags, and feedback visible to incoming members (frontend prototype; no AI grading).
- [x] Activity feed and settings preference UI.
- [x] Browser localStorage persistence for dashboard data, handovers, approvals, answers, and activity.

## 3. Pending — highest priority

### P0 — Production foundation
- [x] Add Supabase project URL and publishable-key environment configuration (configuration only; no live client connection yet).
- [ ] Integrate the Supabase client and verify a live, non-privileged connection.
- [ ] Select and integrate a production authentication provider (deferred; keep demo access for hackathon judging).
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
- [x] Let outgoing members edit knowledge questions and answers after a manager requests changes, then resubmit for approval (frontend prototype).
- [x] Add manager review comments, requested changes, approval/rejection, and local review history (frontend prototype; not a server audit log).
- [ ] Generate incoming-member questions from approved claims and source permissions.
- [ ] Support recall, reasoning, scenario, and uncertainty question types.
- [ ] Evaluate free-text answers against source-backed evidence.
- [ ] Provide explanations, citations, follow-up questions, and weak-area feedback.
- [ ] Update readiness scores from actual verification results rather than sample percentages.
- [ ] Give managers a readiness report showing gaps, evidence, and recommended next actions.
- [x] Add a manager-facing review queue for submitted verification answers, with reviewed/knowledge-gap states and feedback returned to the incoming member (frontend prototype).

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
| Database | Supabase URL/key configuration is prepared, but no client requests, schema, or database persistence are connected. |
| Persistence | Browser localStorage; data is local to that browser/device. |
| Knowledge sources | Sample source records with localStorage-backed demo connect/disconnect and simulated refresh controls; no live connectors or external account access verified. |
| AI analysis | Sample findings in UI; no live ingestion or AI analysis verified. |
| Handover | Local prototype state; not yet a server-backed, auditable workflow. |
| Verification | UI and local answer state; no complete evidence-based grading pipeline verified. |
| Readiness | Sample percentages; not yet calculated from a production verification engine. |
| Permissions | Role metadata exists in the client; server-side enforcement is pending. |

## 5. Next build sequence

### Frontend-only priorities (hackathon demo)
1. [x] Audit and fix role-specific frontend identity and interaction inconsistencies.
2. [x] Complete the demo handover lifecycle and manager review experience.
3. [x] Complete incoming-member verification screens and feedback states (per-handover progress, saved-answer states, and manager feedback; AI grading remains pending).
4. [x] Add interactive knowledge-source demo management (local connect/disconnect, simulated refresh, and activity history; no live integrations).
5. Improve AI-analysis and readiness-report interactions.
5. Validate responsive layouts, navigation, loading, empty, and error states.

Backend integrations and production authentication remain deferred while the hackathon demo is being prepared.


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

### 2026-11-08 — Interactive knowledge-source demo management
- **Completed:** Replaced the static source cards with local demo connection controls for GitHub, Jira, Confluence, Slack, Figma, and Google Drive. Admins can connect or disconnect a sample source and run a clearly labelled simulated refresh. The UI displays connection status and the last demo refresh time. Source state is persisted in browser localStorage, and connect/disconnect/refresh actions are added to the activity feed. Existing saved data without source state is normalized to the sample defaults.
- **Still pending:** OAuth, external account access, real API calls, source permission scopes, ingestion, retry/error handling for real syncs, and source-backed AI analysis.
- **Files changed:** `src/lib/quick-connect-store.tsx`, `src/components/qc/Sections.tsx`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** Re-fetched the changed files from GitHub and checked legacy localStorage fallback, source state initialization, connect/disconnect guards, connected-only simulated refresh, visible demo disclaimer, last-refresh rendering, and activity logging. Build, lint, and automated tests were not run because no repository terminal/runtime was available.
- **Decisions / blockers:** Kept this as a frontend-only hackathon demo. No credentials are requested or stored, and no external service is contacted. The displayed source item counts remain sample data.
- **Next action:** Improve the AI-analysis interaction using the existing sample source and handover data, without claiming live AI processing.

### 2026-11-08 — Manager verification answer review
- **Completed:** Added a manager/admin review queue for incoming-member verification answers. Managers can inspect the handover, respondent, question, submitted answer, and timestamp; mark an answer reviewed with optional feedback; or flag a knowledge gap with required feedback. Review status and reviewer attribution are stored in localStorage. Incoming members see the manager's decision, comment, reviewer, and timestamp alongside their saved answer history.
- **Still pending:** AI/evidence-based grading, source citations, automatic knowledge-gap detection, answer editing/resubmission, and readiness scores calculated from reviewed results. This remains a frontend-only demo workflow, not an auditable server review.
- **Files changed:** `src/lib/quick-connect-store.tsx`, `src/components/qc/Sections.tsx`, `src/components/qc/dialogs.tsx`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** Re-fetched the changed files from GitHub and checked legacy localStorage normalization, answer-review state, manager review actions, required gap feedback, reviewer attribution, and incoming-member feedback rendering. Build, lint, and automated tests were not run because no repository terminal/runtime was available.
- **Decisions / blockers:** Kept the feature frontend-only and manual; the UI explicitly does not claim AI grading. Existing demo authentication, sample data, role navigation, and localStorage persistence remain.
- **Next action:** Improve the knowledge-source management interactions, keeping all integrations simulated until a separate backend task is approved.

### 2026-11-08 — Incoming-member verification progress and feedback
- **Completed:** Incoming members now see an overall verification progress summary and individual progress cards for each approved handover assigned to them. Cards show answered/total counts, completion state, and Start/Continue/Review actions. The verification dialog shows per-handover progress, a saved-answer history with timestamps, a clear current question count, and completion messaging. Answer submissions are checked against an approved handover assigned to that person and duplicate answers are blocked.
- **Still pending:** AI/evidence-based grading, explanations and citations, question types, manager review of answer quality, and readiness scores calculated from actual results. The workflow remains a localStorage-backed demo.
- **Files changed:** `src/components/qc/Sections.tsx`, `src/components/qc/dialogs.tsx`, `src/lib/quick-connect-store.tsx`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** Re-fetched the updated files and checked progress calculations, person/handover scoping, saved-answer rendering, submission validation, duplicate prevention, and tracker entries. Build, lint, and automated tests were not run because no repository terminal/runtime was available.
- **Decisions / blockers:** Did not imply that answers are AI-graded. The UI explicitly describes responses as saved for manager review; no backend or AI integration was added.
- **Next action:** Add a manager-facing review view for incoming-member answers, with a way to mark knowledge gaps and provide feedback.


### 2026-11-08 — Outgoing handover edit and resubmission
- **Completed:** Outgoing members can edit the knowledge questions and answers on a handover marked Changes requested, then save and resubmit it. Resubmission returns the handover to Pending approval, retains prior review comments/history, and adds an activity entry attributed to the outgoing member. The store only accepts resubmission from the handover owner while the status is Changes requested.
- **Still pending:** Adding/removing knowledge items, a richer chronological review timeline, and automated lifecycle tests. Persistence remains browser localStorage.
- **Files changed:** `src/lib/quick-connect-store.tsx`, `src/components/qc/Sections.tsx`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** Re-fetched source files and checked the owner/status guard, trimmed question/answer validation, status reset, activity attribution, and edit/resubmit UI. Build, lint, and automated tests were not run because no repository terminal/runtime was available.
- **Decisions / blockers:** Kept the workflow frontend-only and preserved demo authentication, sample data, and localStorage. Rejected and approved handovers remain non-editable.
- **Next action:** Complete the incoming-member verification flow with clearer per-handover progress and feedback states.


### 2026-11-08 — Manager handover review workflow
- **Completed:** Expanded handover statuses to include Changes requested and Rejected. Added manager review comments, request-changes and reject actions, retained approval attribution, and recorded review history in local app state. Latest manager feedback is visible on the handover row to the handover owner. Existing saved browser data is normalized with an empty review history when the new field is absent.
- **Still pending:** Outgoing members cannot yet edit and resubmit the handover content after a change request; review history is localStorage-backed and is not a server audit log. Add explicit resubmission and richer review timeline in a later frontend task.
- **Files changed:** `src/lib/data.ts`, `src/lib/quick-connect-store.tsx`, `src/components/qc/Sections.tsx`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** Re-fetched source files from GitHub and checked the new status model, review actions, persistence compatibility, and feedback rendering. Build, lint, and automated tests were not run because no repository terminal/runtime was available.
- **Decisions / blockers:** Kept the workflow frontend-only with localStorage persistence. Existing demo authentication and sample data remain. Role checks are UI controls, not server authorization.
- **Next action:** Add an outgoing-member edit and resubmit path for handovers marked Changes requested, then validate the full lifecycle.


### 2026-11-08 — Role-based frontend navigation and actions
- **Completed:** Added role-specific sidebar navigation and section-level access guards. Outgoing members see their own handovers and can create handovers for themselves; incoming members see their own verification workflow; project managers can review handovers and readiness; organisation admins retain the full demo workspace. Dashboard actions and summary links now reflect the active role. Handover creation defaults to the active user and prevents outgoing members from selecting another sender.
- **Still pending:** Role-specific project data filtering beyond the handover and verification views; deeper manager review lifecycle; automated role-permission tests. These are frontend demo controls only, not server-enforced security.
- **Files changed:** `src/components/qc/AppShell.tsx`, `src/components/qc/Sections.tsx`, `src/components/qc/dialogs.tsx`, `src/components/qc/Dashboard.tsx`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** Re-fetched the four changed source files from GitHub and verified expected role filters, access guards, and action conditions. Build, lint, and automated tests were not run because no repository terminal/runtime was available.
- **Decisions / blockers:** Preserved demo authentication, role switching, existing layout, sample data, and localStorage. UI role restrictions are for the hackathon demo and do not replace backend authorization.
- **Next action:** Review the handover lifecycle and manager review experience as the next frontend-only task.


### 2026-11-08 — Frontend demo identity consistency
- **Completed:** Dashboard greeting now uses the active demo user. Handover approval records and its activity entry now use the active demo user instead of a fixed sample admin.
- **Still pending:** Broader frontend audit, role-specific workflow review, and responsive/error-state validation.
- **Files changed:** `src/components/qc/Dashboard.tsx`, `src/components/qc/Sections.tsx`, `src/lib/quick-connect-store.tsx`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** Source-level review only; build, lint, and automated tests were not run because no repository terminal/runtime was available.
- **Decisions / blockers:** Kept the existing demo authentication, role switching, UI layout, sample data, and localStorage persistence. No backend or Supabase work was performed.
- **Next action:** Continue the frontend audit with the next highest-impact role-specific workflow inconsistency.


### 2026-11-08 — Supabase public environment configuration only
- **Completed:** Added a local environment template for the Supabase project URL and publishable key, added a small configuration reader, and ignored local environment files so credentials are not committed. Documented setup and security boundaries.
- **Still pending:** The Supabase SDK/client is not installed or connected, no API request has been made, and no database schema or persistence is implemented. Authentication is deliberately deferred; the existing demo sign-in and sample workflows remain unchanged for hackathon judging.
- **Files changed:** `.gitignore`, `.env.example`, `src/lib/supabase-config.ts`, `README.md`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** GitHub source edits only. Build, lint, tests, and a live Supabase connectivity check were not run because no repository terminal/runtime was available.
- **Decisions / blockers:** The publishable key supplied in chat was not committed to the repository. Copy `.env.example` to `.env.local` locally and enter the project URL and publishable key there. No authentication, login UI, role behavior, database migration, or demo data flow was changed.
- **Next action:** When needed, add the Supabase client SDK and perform a minimal read-only connectivity check; keep authentication and production role enforcement until the final hackathon-hardening phase.

### 2026-11-08 — Remove platform-specific tooling and telemetry
- **Completed:** Replaced the editor-provided Vite wrapper with the standard Vite + TanStack Start + React + Tailwind + Nitro configuration; removed the editor-only dev dependency and project metadata; removed editor-specific error telemetry; kept the existing app error boundary and server error handling; replaced the generated platform-specific repository instructions with neutral project guidance.
- **Still pending:** Build, lint, tests, and local runtime validation have not been run in this session. The database remains a design only; no provider has been selected or connected.
- **Files changed:** `vite.config.ts`, `package.json`, `package-lock.json`, `src/routes/__root.tsx`, editor telemetry module (deleted), editor project metadata (deleted), `AGENTS.md`, `docs/DATABASE-DESIGN.md`, `docs/IMPLEMENTED-VS-PENDING.md`.
- **Checks:** GitHub source edits only; no local install/build/lint/test was available. Confirmed the platform-specific package and metadata references were removed from the files edited.
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
