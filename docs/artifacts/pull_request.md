# Artifact: Pull Request (PR)

A digital record and interface where code changes are reviewed, discussed, and automated validation is run. The PR acts as the primary gatekeeper for the [Release Branch](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/artifacts/release_branch.md).

## Contents
*   **Description:** Explaining the why and how of the changes.
*   **Diff:** File-by-file changes between the target branch and source branch.
*   **CI Check Statuses:** Results of tests, lints, and security scans.
*   **Reviews & Approvals:** Logs of review comments and approvals from peers.

## Ownership & Lifecycle
*   **Created By:** [Developer](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/developer.md) (initiating review).
*   **Approved By:** Peer [Developers](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/developer.md) and/or [Product Managers](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/product_manager.md).
*   **Lifecycle:** Opened -> Under Review -> Changes Requested / Approved -> Merged into destination branch.

## Validation Checks
*   **Reviews:** Minimum of 1 (or 2 depending on repo) peer approvals required.
*   **CI Status:** All automated unit and lint checks must pass (returns green).
*   **Merge Conflict Resolution:** Must not have conflicts with the target branch.
