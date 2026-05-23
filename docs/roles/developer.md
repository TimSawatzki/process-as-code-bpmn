# Developer Role Definition

Developers are responsible for translating product requirements into functional code, ensuring code quality, participating in peer reviews, and resolving issues surfaced during CI/CD or QA verification.

## Key Responsibilities
*   **Feature Implementation:** Write and modularize code in accordance with architectural standards.
*   **Process Initiation:** Trigger the release process by pushing code and opening a [Pull Request](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/artifacts/pull_request.md).
*   **Peer Review:** Review and provide feedback on Pull Requests opened by other Developers.
*   **Bug Fixing:** Act on test failures and QA feedback by creating and applying hotfixes or updates.

## Access Levels
*   **Write Access:** Feature branches and personal forks.
*   **Read Access:** Production repositories, CI/CD dashboard, and staging logs.
*   **Trigger Permissions:** CI trigger via branch pushes.

## Process Touchpoints
1.  **Code Review & PR Approval:** Initiator (opens PR) and reviewer (approves PR).
2.  **Fix Bugs (Loop-back):** Responsible for picking up failed test reports and fixing code.
