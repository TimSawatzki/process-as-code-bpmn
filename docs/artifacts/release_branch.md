# Artifact: Release Branch

A designated Git branch (typically matching the naming pattern `release/v*.*.*`) created to isolate the release payload for testing, hotfixing, and eventual production deployment.

## Contents
*   **Release Version tag:** Semantic Version (e.g., `v1.2.0`).
*   **Code Payload:** All approved feature branches merged from `main` or `develop`.
*   **Version Bump Commit:** Updates file versions (e.g., `package.json`).

## Ownership & Lifecycle
*   **Created By:** Release Automation or Developer (acting on release schedule).
*   **Maintained By:** [Developers](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/developer.md) (applying bug fixes during QA).
*   **Lifecycle:** Branched from main integration branch -> frozen for QA -> merged to main/production upon successful release -> archived/deleted after tag creation.

## Validation Checks
*   **Branch Protection Rules:** Direct commits are blocked. Changes must go through Pull Requests.
*   **Linear History:** Required for all commits on the branch.
