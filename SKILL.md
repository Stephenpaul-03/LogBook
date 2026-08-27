# LogBook project skill

Use this file as the project-specific operating guide before changing LogBook. It is
intentionally written for an agent or developer who has not seen the repository before.

## Purpose and scope

LogBook is a Vite + React + TypeScript documentation viewer. It serves markdown files
from `public/content/`, renders them in a shared document layout, and lets the user
switch between the registered projects LogBook and Cascade.

This repository currently has no application server, database, authentication system,
user account system, form handler, analytics integration, or API route. Do not describe
those as existing features in documentation or legal copy unless the implementation
changes first.

This guide is implementation guidance, not legal advice. Legal pages must be reviewed
by the project owner and, where appropriate, qualified counsel before publication.

## Read first

For a normal content or UI change, inspect these files in this order:

1. `src/App.tsx`
2. `src/components/layout/AppShell.tsx`
3. `src/constants/projects.ts`
4. `public/content/LogBook_Sidebar.json` and `public/content/Cascade_Sidebar.json`
5. the relevant markdown file under `public/content/`

For legal or privacy work, also inspect every data-bearing browser call:

- `src/components/theme/theme-provider.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/property/PropertyRenderer.tsx`
- `src/components/layout/TopNavbar.tsx`
- the deployment configuration outside this repository, if available

## Runtime architecture

The runtime flow is:

```text
main.tsx
  -> App.tsx
    -> ThemeProvider
      -> DesktopOnlyGuard (currently a transparent wrapper)
        -> AppShell
          -> fetch project sidebar JSON
          -> verify markdown files with same-origin HEAD requests
          -> PropertyRenderer fetches and parses markdown
          -> DocumentLayout renders the resulting HTML
```

Important implementation facts:

- `PROJECTS` in `src/constants/projects.ts` is the source of truth for project
  registration. Current IDs are `LogBook` and `Cascade`.
- Each project has a sidebar JSON URL. The sidebar is data, not a compiled React
  route table.
- `AppShell` maps browser paths such as `/LogBook-privacy-policy` back to a project
  ID and a markdown slug. Navigation uses `history.pushState`; there is no router.
- Sidebar entries are dynamically filtered when their markdown files cannot be found.
- `PropertyRenderer` uses the resolved markdown URL when available, then falls back
  to slug-based candidates. Keep the sidebar path, slug, category title, and file
  location consistent.
- Markdown is parsed by `src/lib/markdown-parser.ts` and rendered with `marked`.
  `DocumentLayout` uses `dangerouslySetInnerHTML`, so markdown is trusted project
  content; do not add user-submitted markdown without adding sanitization.
- Theme preference is stored in browser `localStorage` under the key passed to
  `ThemeProvider` (`cascade-ui-theme` in `App.tsx`). The custom/system context menu
  preference uses `cascade-use-system-menu` in `AppShell`.
- Content is requested from same-origin `/content/...` URLs. A static host, CDN,
  reverse proxy, or security layer may still create server logs; source code alone
  cannot establish the deployment's retention or processor practices.

## Content and navigation model

Each sidebar JSON file has this shape:

```json
{
  "home": { "label": "Home", "path": "/" },
  "categories": [
    {
      "title": "Legal",
      "topics": {
        "Privacy Policy": "/docs/privacy-policy",
        "Terms of Use": "/docs/terms-of-use"
      }
    }
  ]
}
```

For a topic with path `/docs/privacy-policy`, the preferred file is:

```text
public/content/<ProjectId>/docs/privacy-policy.md
```

The loader also checks category-based and numbered filename candidates. Prefer the
direct `docs/<slug>.md` convention for legal pages because it is predictable and
independent of display-label spelling.

When adding a page:

1. Add the topic to the correct project sidebar JSON.
2. Add its markdown file under that project's content directory.
3. Use a stable, lowercase slug and do not rename an already-published legal slug
   without considering existing links and search indexes.
4. Run `npm run lint` and `npm run build`.
5. Verify the page through the generated URL and from the sidebar in both projects.

There are no Support or Mini Portfolio routes in the current product. Do not recreate
them as React pages or re-add them to either sidebar. If a future support channel is
needed, document an external URL or email explicitly and update the privacy/legal
contact details at the same time.

## Legal-content workflow

Legal copy should describe the deployed product, not an aspirational roadmap. Before
writing or revising legal pages, create or confirm a fact sheet containing:

### Publisher and jurisdiction

- Legal name of the publisher or operator
- Business/entity type and registration details, if applicable
- Principal business address
- Privacy/legal contact email and any designated representative
- Governing law and venue
- Intended audience and minimum age, if relevant
- Effective date and last-updated date

These values are not present in this repository. Use explicit placeholders such as
`[PUBLISHER LEGAL NAME]` during drafting; never invent a person, address, jurisdiction,
email address, regulator, or retention period.

### Product and access facts

- Product name and each deployed domain
- Whether the site is public, private, invite-only, or licensed
- What “LogBook” and “Cascade” mean in the deployment
- Availability, maintenance, and change-notice expectations
- Whether content is informational only and any professional-advice disclaimer
- Copyright owner, license for repository code, and third-party notices
- Rules for acceptable use, scraping, automated access, and security testing

### Data and privacy facts to verify

The current source supports the following narrow statements:

- The app reads static project configuration and markdown from same-origin URLs.
- The app stores the selected theme in `localStorage`.
- The app stores the custom/system context-menu preference in `localStorage`.
- The app has no visible login, registration, contact form, payment flow, or user
  content submission flow.
- No analytics, advertising, cookie, database, or external tracking integration is
  present in the source search at the time this guide was written.

The following cannot be inferred from the frontend source and must be supplied by the
deployment owner:

- Web-server/CDN access logs, IP-address handling, and retention
- Hosting provider, CDN, DNS, error monitoring, or security-service processing
- Cookies or headers added by infrastructure
- Data transfers, international locations, subprocessors, and safeguards
- Backup, deletion, and incident-response practices
- Whether a reverse proxy records `HEAD` and `GET` requests
- Any future links, embeds, GitHub integrations, or external services

Do not claim “no data is collected” without qualifying it against hosting logs and
third-party infrastructure. Distinguish browser-local preference storage from server-
side request metadata.

## Recommended legal document set

Choose the documents that match the actual deployment. Avoid duplicate documents with
conflicting language; “Terms and Conditions” and “Terms of Use” are often one document
with one canonical URL.

1. **Terms of Use / Terms and Conditions** — access, license, restrictions, changes,
   disclaimers, liability limits, termination, governing law, and contact details.
2. **Privacy Policy / Data Usage Notice** — categories of data, purposes, legal basis
   where relevant, local storage, server logs, providers, retention, rights, transfers,
   children’s privacy, security, and contact details.
3. **Cookie or Local Storage Notice** — only if the deployment uses cookies or if a
   separate explanation of browser storage is useful; accurately state that current
   app preferences use `localStorage`, not cookies.
4. **Acceptable Use / Security Policy** — only if the operator needs rules for abuse,
   automated traffic, vulnerability reporting, or content reuse.
5. **Copyright / Third-Party Notices** — repository license and dependency/license
   obligations, if the project is distributed or publicly hosted.
6. **Accessibility statement** — only after the owner can provide a real contact and
   describe the supported standard and remediation process.

For each document, include a visible title, effective date, version or last-updated
date, canonical route, owner/contact, and links to related documents. Add a new page to
the relevant sidebar only after its markdown file exists.

## Legal page template

Use this structure for a draft, replacing every bracketed value before publication:

```md
# [Document title]

**Effective date:** [YYYY-MM-DD]  
**Last updated:** [YYYY-MM-DD]  
**Operator:** [PUBLISHER LEGAL NAME]

> This draft must be reviewed for the actual deployment, jurisdiction, and audience.

## 1. Scope

What service, domain, project, and users does this document cover?

## 2. Definitions

Define only terms used in the document.

## 3. [Topic-specific sections]

Describe the real behavior and the user's rights and responsibilities.

## Contact

[PUBLISHED LEGAL OR PRIVACY CONTACT]
```

For privacy documents, add a table mapping each data category to source, purpose,
retention, sharing, and user controls. Mark unknown infrastructure facts as unresolved
items rather than filling them with guesses.

## Change and release procedure for legal content

When implementation changes any data flow, storage key, external service, form,
analytics, cookie, payment, account behavior, or hosting provider:

1. Update the legal fact sheet in this guide or the project’s deployment notes.
2. Search the repository for the old behavior and all affected legal terms.
3. Update the relevant markdown policy and its `Last updated` value.
4. Review links, sidebar entries, and canonical slugs.
5. Record the change in `public/content/LogBook/docs/changelogs.md` when it is user-
   visible.
6. Run lint/build and manually open every legal page in the production-like build.

Never silently change a published policy to match an unverified assumption. If a legal
fact is unknown, stop at a clearly marked placeholder and ask the owner for the fact.

## Verification checklist

Before handing off a change:

- `rg -n "support|mini.?portfolio|contact" src public` contains no removed route,
  sidebar entry, or stale page reference (generic words such as “supports” are fine).
- Every sidebar topic has a reachable markdown file.
- Legal pages contain no unresolved placeholders unless explicitly delivered as a
  draft.
- Legal claims match source code and deployment facts.
- No new form, storage, cookie, analytics, or external request is introduced without
  updating the privacy/data-usage review.
- `npm run lint` passes.
- `npm run build` passes.

Useful commands:

```sh
npm run lint
npm run build
rg --files src public
rg -n "localStorage|sessionStorage|fetch\\(|document\\.cookie|analytics|stripe|sentry" src public
```
