# Process-as-Code — BPMN Portal

**Model, version, and visualize your software delivery processes as code.** BPMN 2.0 diagrams, roles, artifacts, and glossary — all in one interactive portal, deployable to GitHub Pages.

---

## Why Process-as-Code?

| Principle | What it means |
|---|---|
| **Version Control** | Every process change is tracked in Git — who changed what, when, and why. |
| **Auditability** | Full commit history for SOPs, approval flows, and release pipelines. |
| **Single Source of Truth** | The BPMN diagram, roles, and artifacts all live in one repo. |
| **Interactive** | Click any BPMN element to see linked roles, artifacts, and descriptions. |

---

## What's Inside

```
process-as-code-bpmn/
├── index.html                  # Portal entry point
├── css/
│   └── styles.css              # Dark glassmorphic theme
├── js/
│   ├── data.js                 # Roles, artifacts, glossary, element mappings
│   └── app.js                  # Application controller & BPMN viewer
├── processes/
│   └── software_release_flow.bpmn   # BPMN 2.0 XML (loaded at runtime)
├── docs/
│   ├── roles/                  # Role definitions (Markdown)
│   │   ├── developer.md
│   │   ├── product_manager.md
│   │   ├── qa_engineer.md
│   │   └── release_manager.md
│   └── artifacts/              # Artifact definitions (Markdown)
│       ├── pull_request.md
│       ├── release_branch.md
│       ├── test_report.md
│       └── deployment_manifest.md
├── glossary.md                 # Standalone glossary
└── README.md
```

---

## Quick Start

### Option 1: Open directly
Open `index.html` in any modern browser. The BPMN diagram is fetched from the local `.bpmn` file — works great with GitHub Pages.

### Option 2: Local dev server
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

### Option 3: GitHub Pages
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder
4. Your portal is live at `https://<user>.github.io/<repo>/`

---

## How the Portal Works

| View | What you see |
|---|---|
| **Dashboard** | Stats, process flow mini-map (clickable steps) |
| **BPMN Visualizer** | Full interactive BPMN 2.0 diagram — click elements, zoom, pan |
| **Roles** | Cards for each process actor — click for responsibilities, permissions, touchpoints |
| **Artifacts** | Cards for each deliverable — click for contents, lifecycle, validation rules |
| **Glossary** | All BPMN and process-as-code terminology |

Clicking any BPMN element opens a detail modal showing:
- Element type and description
- Linked role (click to jump)
- Linked artifact (click to jump)

---

## The Modeled Process

The `software_release_flow.bpmn` models a standard enterprise release pipeline:

1. **Release Triggered** — Feature freeze reached
2. **Code Review & PR Approval** — Peer review gate
3. **CI Build & Tests** — Automated build + unit tests
4. **Tests Pass?** — Gateway: pass → staging, fail → fix loop
5. **Staging Deployment & QA** — Manual exploratory testing
6. **Release Sign-off** — Release Manager approval
7. **Production Deployment** — Canary rollout
8. **Deployed & Monitored** — Live in production

---

## Adding Your Own Process

1. **Create a `.bpmn` file** in `processes/` (use [demo.bpmn.io](https://demo.bpmn.io) to model it)
2. **Define roles** in `js/data.js` under `ProcessData.roles`
3. **Define artifacts** in `js/data.js` under `ProcessData.artifacts`
4. **Map elements** in `js/data.js` under `ProcessData.processElements` (link BPMN element IDs to roles/artifacts)
5. **Update the flow** in `js/data.js` under `ProcessData.processFlow` for the dashboard mini-map

---

## Tech Stack

- **bpmn-js** (v17) — BPMN 2.0 rendering
- **Font Awesome 6** — Icons
- **Inter** — Typography
- **Vanilla JS** — No frameworks, zero build step
- **CSS Custom Properties** — Theming

---

## License

MIT — use it, remix it, ship it.
