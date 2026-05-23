# Glossary of Process-as-Code and BPMN Terms

This glossary defines standard terminology used within our processes, roles, and artifact documentation.

### BPMN (Business Process Model and Notation)
A graphical representation for specifying business processes in a workflow diagram. It provides a standard notation that is easily understandable by all business users, developers, and analysts.

### Process-as-Code
The practice of managing workflow definitions, rules, and procedures using text-based configuration files or code files (like BPMN XML) under version control. It allows software development processes to be automated, validated, and audited similarly to source code.

### Start Event
The event that initiates a business process. In our software release flow, this is the "Feature Complete" event. Visually represented by a thin-circle outline.

### End Event
The final state of a process, representing completion. In our flow, this is the "Release Deployed & Monitored" event. Visually represented by a thick-circle outline.

### Task / Activity
A single unit of work within a process that cannot be broken down further (or doesn't need to be).
*   **User Task:** A task requiring human action (e.g., Code Review or Staging QA).
*   **Service Task:** A task executed by an automated service or software system (e.g., CI Unit Testing).

### Gateway
A decision point in the process that controls the flow of execution based on specific conditions.
*   **Exclusive Gateway (XOR):** Restricts the flow to exactly one outgoing branch based on conditions (e.g., "Tests Pass?"). Visually represented by a diamond shape with an 'X' or blank interior.

### Sequence Flow
The connection that defines the execution path and order of activities. Visually represented by a solid line with an arrow.

### Artifact
Any input, output, or physical/digital deliverable generated during a process. In this repo, artifacts include [Pull Requests](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/artifacts/pull_request.md), [Test Reports](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/artifacts/test_report.md), [Release Branches](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/artifacts/release_branch.md), and [Deployment Manifests](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/artifacts/deployment_manifest.md).

### Role
A definition of responsibilities, permissions, and skills required by an actor executing a task in the process. Roles include [Developer](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/developer.md), [Product Manager](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/product_manager.md), [QA Engineer](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/qa_engineer.md), and [Release Manager](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/release_manager.md).
