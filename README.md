# LogBook

LogBook is a desktop-first documentation hub for browsing multiple collections of structured Markdown notes. It currently ships with LogBook and Cascade workspaces, each with its own sidebar and content tree.

## Features

- Switch between independent documentation projects
- Project sidebars loaded from JSON
- Markdown pages with optional layouts, code blocks, and quiz blocks
- Searchable navigation and command palette
- System-aware light and dark themes
- Desktop-only guard for the intended reading experience

## Tech stack

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- Radix UI and shadcn/ui patterns
- `marked` for Markdown rendering

## Getting started

Requirements: Node.js 18+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Build and preview the production version with:

```sh
npm run build
npm run preview
```

## Content model

Projects are registered in `src/constants/projects.ts`. Each project points to a sidebar JSON file, which maps categories and topics to Markdown files in `public/content/`:

```text
src/constants/projects.ts
public/content/<ProjectId>_Sidebar.json
public/content/<ProjectId>/home.md
public/content/<ProjectId>/<Category>/<entry-slug>.md
```

Add a project to `PROJECTS`, create its sidebar JSON, and add the referenced Markdown files. Topic files can use the plain slug or the supported `01-<slug>.md` / `1-<slug>.md` prefixes. See [USAGE.md](USAGE.md) and [ADDING_SUBJECTS.md](ADDING_SUBJECTS.md) for the detailed content workflow.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |

Run `npm run build`, `npm run lint`, and `git diff --check` before committing.
