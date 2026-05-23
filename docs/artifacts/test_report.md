# Artifact: Test Report

A comprehensive summary documenting the outcomes of all automated test suites and manual QA cycles executed on the [Release Branch](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/artifacts/release_branch.md) in the Staging environment.

## Contents
*   **Execution Metadata:** Time, commit hash, environment details.
*   **Automated Test Summary:** Pass/fail counts for integration, E2E, and regression tests.
*   **Manual QA Logs:** Status of exploratory tests run by the QA team.
*   **Open Defects List:** Any non-blocking bugs discovered during verification.

## Ownership & Lifecycle
*   **Created By:** Automated test runners (for unit/integration) and [QA Engineers](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/qa_engineer.md) (for manual runs).
*   **Reviewed By:** [Release Manager](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/release_manager.md) (during sign-off evaluation).
*   **Lifecycle:** Compiled at the end of staging verification -> attached to the release manifest -> archived for compliance.

## Validation Checks
*   **Critical Blockers:** Zero (0) open P0/P1 bugs.
*   **Test Coverage:** Minimum 80% code coverage.
*   **Integration Status:** All test groups completed without environment setup errors.
