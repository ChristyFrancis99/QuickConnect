# KnowFlow — AI-Powered Knowledge Handover Platform

**Capture. Verify. Transfer.**

KnowFlow is a knowledge handover platform designed to reduce knowledge loss when people leave a team, change roles, or move between projects. It brings project context, handover documentation, knowledge verification, and team readiness into one workspace.

Instead of relying on scattered documents and informal conversations, teams can organise project knowledge, prepare structured handovers, review knowledge gaps, and help incoming members understand the work they are taking over.

> This repository currently contains the application UI and prototype workflows. Authentication and selected interactions use local/demo logic; connect production identity, data storage, and AI services before using the platform with real organisational data.

## Core Workflows

KnowFlow supports four role-based workflows:

| Role | Main responsibility |
| --- | --- |
| **Outgoing Member** | Documents project context, prepares handover material, and transfers knowledge. |
| **Incoming Member** | Reviews the handover, asks questions, and completes knowledge verification. |
| **Project Manager** | Reviews handovers, tracks knowledge gaps, and monitors team readiness. |
| **Organisation Admin** | Manages people, permissions, knowledge sources, and organisation settings. |

## Platform Modules

- **Dashboard** — Overview of projects, handover progress, team activity, and important status updates.
- **My Projects** — Project-level workspace for organising work and related knowledge.
- **Team Members** — Team directory and role-oriented member information.
- **Knowledge Sources** — Central place for project knowledge and source material.
- **AI Analysis** — Workspace for analysing project information and identifying knowledge gaps.
- **Handover Reports** — Structured handover records and progress.
- **Knowledge Verification** — Incoming-member knowledge checks and verification workflow.
- **Readiness Reports** — Visibility into handover completion and incoming-member readiness.
- **Activity & History** — Recent actions and workspace activity.
- **Settings** — Workspace and account configuration.

## Technology Stack

- **Frontend:** React 19, TypeScript
- **Application framework:** TanStack Start
- **Routing:** TanStack Router
- **Build tooling:** Vite
- **Styling:** Tailwind CSS 4
- **UI primitives:** Radix UI
- **Forms and validation:** React Hook Form, Zod
- **Data visualisation:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Testing:** Vitest, Testing Library

## Getting Started

### Prerequisites

- Node.js (use a current LTS release)
- npm

### Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/ChristyFrancis99/QuickConnect.git
cd QuickConnect
npm install
```

### Run the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run build:dev` | Create a development-mode build. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run test` | Run the test suite once. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run format` | Format project files with Prettier. |

## Project Structure

The application is organised around route-based pages and shared components. Key areas include:

- `src/routes/` — Application pages and route definitions.
- `src/components/` — Reusable interface components.
- `src/lib/` — Shared application logic, data, and authentication context.
- `public/` — Static assets served by the application.

## Current Prototype Notes

- The sign-in experience includes email/username and password fields, password reset UI, Google sign-in selection, and an organisation-admin access request flow.
- The current authentication context uses an in-app team directory and simulated credential checks. It is intended for prototyping, not secure production authentication.
- Some integrations and AI-related workflows are represented by interface-level or demo interactions. Production deployment will require connecting approved data sources, an AI service, persistent storage, and organisation-managed authentication and permissions.
- Do not enter real passwords, confidential source code, or sensitive company information into the prototype.


## Project Goal

The goal of KnowFlow is to make project knowledge transferable, traceable, and verifiable—so that when a team member moves on, the team's understanding of the work does not move with them.
