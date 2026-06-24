# Paragon Capital — Deal & Diligence OS

A high-fidelity, interactive prototype of a private-equity **deal & diligence operating system**. Paragon takes a firm from raw inbound deal flow all the way to an investment-committee memo — with every extracted figure traceable back to its source document.

> Built as a **zero-build** React application: open it in a browser and it runs. No bundler, no `npm install`, no toolchain.

---

## What it does

Focused on **direct PE deals** end-to-end:

| Area | Highlights |
| --- | --- |
| **Home** | Pipeline & sector snapshot, recent deals with expandable AI theses, and a live activity feed (including auto status-changes from email). |
| **Deal Flow** | Inbound pipeline ranked against your thesis, in **Table**, **Pipeline (Kanban)**, **Weekly Review**, and **Archived** views. Move deals between stages, import/export **Excel** trackers (1,000+ rows), and review **email → status** automations. |
| **Deal Workspace** | A per-deal tear sheet — company overview (externally enriched), deal terms, pre/post-money, revenue & EBITDA, statements and key people. **Next Steps & Actionables** (banker calls, pipeline notes), a one-click **screening memo**, an inline **Explore** copilot, and deal-level access settings. |
| **Sector Intelligence** | Signal briefings, **government tenders & policy**, drug-launch / patent-cliff trackers, sentiment, and **Institutional Memory** (analyst coverage, comps, cap tables, market-share history — e.g. Insurance). Ask questions against a sector with **Explore**. |
| **Explore** | A research copilot you can scope to a single deal, a sector, or everything. |
| **Documents** | Deal files, a natural-language query builder, key-clause extraction, and ingestion sources. |
| **Memos & Models** | Auto-draft **screening memos / one-pagers** from emails + IMs using your house templates, build models & comps, and generate an **automated weekly pipeline PDF** for the team. |
| **Settings & Access** | Connected integrations (email source-of-truth, Dropbox, Excel, external/EU alt-data, broker research) and **role-based permission controls**. |

### Built around the feedback

- **Pipeline:** passed deals move to an **Archived** section; companies flow through *triaging → screening → IC review → pursuing* on a Kanban; **actionables** capture next steps after discussions.
- **Automation:** a central intake email (`deals@paragon.com`) is the source of truth; the AI reads "next steps" tables in emails and **auto-updates deal status**; Dropbox, Excel import/export, broker research and EU alternate-data feeds are wired in.
- **Reporting:** screening memos, one-pagers and weekly PDFs generated from your refined templates.
- **Data hygiene:** missing valuation/financials show a clean `—` placeholder rather than errors.
- **Access:** views can be shared firm-wide or **restricted by role**.

### The differentiator: provenance everywhere

Every figure carries a **confidence dot** and links back to a **sourced quote**. Hover any value to view its source documents, override it with a manual value, re-run AI extraction, or report a data issue — with an inline PDF viewer that highlights the cited passage.

---

## Run it

Fully self-contained — **no CDN, no in-browser Babel**. React is vendored in
`vendor/` and the JSX is precompiled into `build/` (both committed), so it runs
as pure static files:

```bash
npm start          # serves the repo root on http://localhost:8000
# or any static server: python3 -m http.server 8000
```

Editing the UI? Change a `.jsx` and recompile:

```bash
npm install        # one-time: installs Babel (build-time only)
npm run build      # recompiles .jsx → build/*.js
```

## Deploy (Cloudflare Pages / any static host)

Nothing to build at deploy time — the repository **is** the deployable site.
`wrangler.toml` sets the Pages output directory to the repo root (`.`).

| Setting | Value |
| --- | --- |
| Build command | *(leave empty)* |
| Build output directory | `/` |

Because React is vendored and the JSX is precompiled, there is no external
runtime dependency and no build step that can fail. (Run `npm run build` only
when you've edited a `.jsx` and want to refresh `build/`.)

---

## Architecture

A deliberately simple SPA with **no bundler and no runtime dependencies**.
`index.html` loads vendored React 18 (`vendor/`) and the precompiled views
(`build/*.js`) as plain classic `<script>` tags. Classic scripts share one
global scope, so files reference each other's top-level components directly and
register views on `window.*` for the router in `app.jsx`. The `.jsx` files are
the source of truth; `npm run build` precompiles them to `build/` (committed).

```
data.js / exploredata.js   Mock domain model → window.DB
icons.jsx                  Feather-style icon set
components.jsx             Shared primitives (Menu, Modal, charts, Prov, StatusPill…)
provenance.jsx             Source modal + highlighted PDF viewer
commandpalette.jsx         ⌘K command palette
home.jsx                   Home dashboard
dealflow.jsx               Deal Flow — table / kanban / weekly / archived, email automation, Excel I/O
workspace.jsx              Deal workspace, tear sheet, actionables, deal settings
dealmodals.jsx             New-deal wizard, section builders
sector.jsx                 Sector intelligence, tenders, institutional memory
documents.jsx              Files, query builder, key clauses, ingestion
memos.jsx                  Memos, models, comps, weekly output
explore.jsx                Explore copilot + global Explore landing
globalfiles.jsx            Firm-wide shared file library
settings.jsx               Settings & Access — integrations + permissions
editsection.jsx            Section configuration editor
app.jsx                    Router, sidebar, top bar, overlays → mounts <App/>

vendor/                    Vendored React 18 (production UMD) — no CDN
build/                     Precompiled JSX → plain JS (generated, committed)
build.mjs                  Precompiler (.jsx → build/)
```

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘K` / `Ctrl-K` | Command palette |
| `⌘N` / `Ctrl-N` | New deal |
| `Esc` | Close any modal / drawer |

---

## Notes

- All data is **mock** and lives in `data.js` / `exploredata.js`; nothing leaves the browser.
- The `screenshots/` folder captures an earlier build and is illustrative only.
