# Release Manager Role Definition

The Release Manager governs the release process. They maintain the release schedule, evaluate risks, coordinate cross-functional approvals, and give the final green light for production deployments.

## Key Responsibilities
*   **Release Planning:** Schedule release cycles and coordinate features across product lines.
*   **Compliance & Audit:** Verify all automated tests, security checks, and approvals are documented.
*   **Final Sign-off:** Review the [Test Report](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/artifacts/test_report.md) and execute the final sign-off step in the release process.
*   **Incident Management:** Oversee rollbacks or hotfixes in case of production deployment failure.

## Access Levels
*   **Write Access:** Release branch configurations, production deployment toggles.
*   **Admin Access:** CI/CD production deployment triggers, repository branch protection bypasses.

## Process Touchpoints
1.  **Release Sign-off:** Primary actor. Conducts final review before production deployment.
2.  **Production Deployment:** Monitors the automated rollouts and handles emergency interventions.
