# Artifact: Deployment Manifest

A configuration file (e.g., Kubernetes YAML files, Terraform configurations, or Helm charts) describing the target architecture state, environment variables, and image versions to deploy.

## Contents
*   **Image Tags:** Exact container registry URLs and version hashes.
*   **Infrastructure Configuration:** CPU/Memory limits, replicas, database connections.
*   **Secrets References:** Encrypted credentials configurations or Vault paths.
*   **Routing Settings:** Ingress rules, load balancer ports, CDN cache invalidations.

## Ownership & Lifecycle
*   **Created By:** Release Engineering templates or [Developers](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/developer.md) (updating dependencies).
*   **Approved By:** [Release Manager](file:///Users/timsawatzki/.gemini/antigravity/scratch/process-as-code-bpmn/docs/roles/release_manager.md) and Devops Lead.
*   **Lifecycle:** Written alongside application code -> validated in Staging -> executed to build Production assets.

## Validation Checks
*   **Configuration Validation:** Linted via `kubeval` or `terraform validate`.
*   **Vulnerability Scanning:** Container base image scanned for critical CVEs.
*   **Downtime Estimation:** Migration and rollover patterns reviewed.
