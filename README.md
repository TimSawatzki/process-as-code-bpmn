# Process-as-Code with BPMN 2.0

Welcome to the **Process-as-Code** repository. This project demonstrates how software development and release operations can be modeled, versioned, and visualized as code. By treating process definitions with the same rigor as source code, teams achieve:

1. **Version Control:** Track changes to standard operating procedures (SOPs) over time using Git.
2. **Auditability:** Every update, approval, and modification is recorded in the Git commit history.
3. **Execution-Ready Docs:** Linking process diagrams directly to the underlying scripts, roles, and artifacts.
4. **Interactive Visualization:** Renders standard BPMN 2.0 XML in real-time, removing ambiguity.

---

## Repository Structure

```
process-as-code-bpmn/
├── README.md                  # Main overview and setup guide
├── glossary.md                # Glossary of process terms
├── docs/                      # Standard Operating Procedure details
│   ├── roles/                 # Definitions of process actors and responsibilities
│   │   ├── developer.md
│   │   ├── product_manager.md
│   │   ├── qa_engineer.md
│   │   └── release_manager.md
│   └── artifacts/             # Outputs/deliverables produced during process steps
│       ├── release_branch.md
│       ├── pull_request.md
│       ├── test_report.md
│       └── deployment_manifest.md
├── processes/
│   └── software_release_flow.bpmn  # Standard BPMN 2.0 XML representation of the process
├── index.html                 # Premium visualizer dashboard
├── styles.css                 # Custom glassmorphic styling
├── bpmn-data.js               # Embedded BPMN XML content for CORS-free loading
└── app.js                     # Client-side interactive visualizer logic
```

---

## Getting Started

### Method 1: The Quick Start (No Setup)
Simply double-click or open the [index.html](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/index.html) file directly in any modern browser. 
*Note: Due to browser CORS policies regarding local file fetching, this method uses a pre-embedded JavaScript representation of the BPMN diagram (`bpmn-data.js`) to display the model instantly.*

### Method 2: Launch a Local Server (Recommended)
To test dynamic loading of the `.bpmn` files, spin up a local web server:

```bash
# Using Python (standard on macOS)
python3 -m http.server 8000
```

Once running, navigate to:
```
http://localhost:8000
```

---

## Process Overview: Software Release Lifecycle

The modeled BPMN diagram (`processes/software_release_flow.bpmn`) illustrates a standard enterprise software release pipeline, including automated checks, loops for bug fixes, manual verifications, and sign-offs.

1. **Trigger:** Release Cycle initiated (Feature Complete / Code Freeze).
2. **Review:** Code review and Pull Request (PR) approval.
3. **CI Pipeline:** Automated build and unit testing execution.
4. **Verification:** Deployment to Staging environments for QA verification.
5. **Sign-off:** Release Manager final check and approval.
6. **Deployment:** Continuous Deployment (CD) canary release to production.
7. **End Event:** Deployed and actively monitored.
