// ============================================================
// Process-as-Code — Data Layer
// All roles, artifacts, glossary, and process element mappings
// ============================================================

const ProcessData = {

  stats: {
    processes: 1,
    roles: 4,
    artifacts: 4,
    steps: 8
  },

  roles: [
    {
      id: 'developer',
      name: 'Developer',
      subtitle: 'Author & Refactor Code',
      icon: 'fa-code',
      color: '#38bdf8',
      desc: 'Translates product requirements into functional code, manages feature branches, initiates PRs, reviews peers, and fixes bugs.',
      responsibilities: [
        'Write modular, clean code that meets architecture specifications.',
        'Create feature branches and open Pull Requests for peer reviews.',
        'Review code from team members and recommend structural optimizations.',
        'Review test failure logs and staging reports to resolve bugs.'
      ],
      permissions: [
        'Write: feature branches, personal forks',
        'Read: production repos, staging logs, CI pipelines'
      ],
      touchpoints: [
        { step: 'Task_CodeReview', action: 'Submits pull request for peer review' },
        { step: 'Task_FixBugs', action: 'Picks up CI failures and deploys bugfixes' }
      ]
    },
    {
      id: 'product_manager',
      name: 'Product Manager',
      subtitle: 'Define Scope & Validate UX',
      icon: 'fa-clipboard-list',
      color: '#a78bfa',
      desc: 'Defines feature scopes, checks business logic alignment in technical reviews, verifies UX on Staging, and assists in release approvals.',
      responsibilities: [
        'Draft Product Requirement Documents (PRDs) detailing feature goals.',
        'Participate in code review meetings for high-priority user-facing tasks.',
        'Perform exploratory checkouts on the Staging environment to verify UX.',
        'Provide release readiness feedback to the Release Manager.'
      ],
      permissions: [
        'Read: codebase repos, PR descriptions, QA dashboards',
        'Write: ticketing systems (Jira/Linear), project roadmaps'
      ],
      touchpoints: [
        { step: 'Task_CodeReview', action: 'Reviews features for product alignment' },
        { step: 'Task_QAStaging', action: 'Checks visual and feature correctness' }
      ]
    },
    {
      id: 'qa_engineer',
      name: 'QA Engineer',
      subtitle: 'Assert Quality & Compliance',
      icon: 'fa-shield-halved',
      color: '#34d399',
      desc: 'Ensures code quality, authors regression test suites, inspects deployments, and compiles the official Test Report artifact.',
      responsibilities: [
        'Maintain, update, and trigger automated regression and E2E test suites.',
        'Conduct functional verification and environment tests on Staging.',
        'Log defects in the bug tracker with reproducible steps.',
        'Create and sign off on the Staging verification Test Report.'
      ],
      permissions: [
        'Write: QA testing frameworks, mock configs, bug trackers',
        'Read: CI runners, build logs, staging infrastructure'
      ],
      touchpoints: [
        { step: 'Task_QAStaging', action: 'Main tester; runs test suites on Staging' }
      ]
    },
    {
      id: 'release_manager',
      name: 'Release Manager',
      subtitle: 'Govern Releases & Infrastructure',
      icon: 'fa-rocket',
      color: '#fbbf24',
      desc: 'Controls release scheduling, ensures compliance checkboxes are met, performs final sign-offs, and oversees production rollouts.',
      responsibilities: [
        'Schedule release cycles and coordinate release payloads across departments.',
        'Verify all unit, integration, and security checks are completed and green.',
        'Approve production deployments and initiate the CD pipeline rollout.',
        'Coordinate rollback actions in the event of production deployment outages.'
      ],
      permissions: [
        'Write: release branch settings, build configuration files',
        'Admin: CI/CD deployment jobs, production environment variables'
      ],
      touchpoints: [
        { step: 'Task_ReleaseSignOff', action: 'Reviews Staging Test Report; approves build' },
        { step: 'Task_ProductionDeploy', action: 'Initiates and monitors production rollout' }
      ]
    }
  ],

  artifacts: [
    {
      id: 'pull_request',
      name: 'Pull Request (PR)',
      subtitle: 'Code Review Gatekeeper',
      icon: 'fa-code-pull-request',
      color: '#38bdf8',
      desc: 'A digital workspace where changes are discussed, reviewed by developers, and tested via automated CI pipelines before merging.',
      contents: [
        'Detailed description of changes with links to ticketing platforms',
        'Diff highlights illustrating modifications across files',
        'Automated CI checklist status (Linter, Unit Tests, Security scan)',
        'Developer review logs and formal approval markings'
      ],
      lifecycle: 'Opened by Developer → Reviewed & Checked by Team → Merged into Release Branch',
      validation: 'Requires passing CI build checks and a minimum of one peer review approval.'
    },
    {
      id: 'release_branch',
      name: 'Release Branch',
      subtitle: 'Stabilization Payload Branch',
      icon: 'fa-code-branch',
      color: '#a78bfa',
      desc: 'A Git branch (release/v*.*.*) isolated from active development, used strictly for release testing, version bumping, and final hotfixing.',
      contents: [
        'Version tag (Semantic Versioning compliance)',
        'Merged release candidate payload commits',
        'Repository version configuration updates (e.g., package.json)'
      ],
      lifecycle: 'Created from integration branch → Frozen for Staging QA → Merged to Main/Prod → Archived',
      validation: 'Direct commits blocked. Commits must be made via PR. Requires linear history.'
    },
    {
      id: 'test_report',
      name: 'Test Report',
      subtitle: 'Quality Sign-off Document',
      icon: 'fa-file-shield',
      color: '#34d399',
      desc: 'A comprehensive document logging the results of automated test suites and manual exploratory testing on Staging.',
      contents: [
        'Target commit hash and deployment execution timestamps',
        'Pass/Fail analytics for unit, API, integration, and E2E checks',
        'Overview of non-blocking defects discovered',
        'QA sign-off confirmation statement'
      ],
      lifecycle: 'Generated after Staging verification → Attached to Release PR → Archived in audit log',
      validation: 'Requires 100% automated test pass rate and zero unresolved blocker bugs (P0/P1).'
    },
    {
      id: 'deployment_manifest',
      name: 'Deployment Manifest',
      subtitle: 'Infrastructure Configuration',
      icon: 'fa-file-lines',
      color: '#fbbf24',
      desc: 'Configuration charts (Kubernetes, Terraform, Helm) that specify container image IDs, runtime environments, and networking rules for production.',
      contents: [
        'Docker registry paths and SHA hashes for deployed containers',
        'Replication parameters, memory allocations, CPU specifications',
        'Database connections and credentials vault endpoints',
        'Ingress load balancer mapping rules'
      ],
      lifecycle: 'Managed in infra repo → Deployed in Staging → Applied during Production Release',
      validation: 'Validated via infrastructure lints (e.g., kubeval) and CVE container registry scans.'
    }
  ],

  glossary: [
    { term: 'BPMN', def: 'Business Process Model & Notation — an open graphical standard used to model and map workflows. Facilitates smooth communication between engineering, product, and operations.' },
    { term: 'Process-as-Code', def: 'Treating operational guidelines, release paths, and infrastructure policies as standard code files. Enables auditing, automation, and Git version control.' },
    { term: 'Start Event', def: 'The starting trigger of a BPMN process diagram (thin border circle). In our system, this is the Feature Complete milestone.' },
    { term: 'End Event', def: 'The final outcome state of a process (thick border circle). Indicates completion of the process goals.' },
    { term: 'User Task', def: 'A human-performed activity within the process. Requires manual action like code review or QA testing.' },
    { term: 'Service Task', def: 'An activity executed by an automated service or software system, such as CI builds or deployment scripts.' },
    { term: 'Exclusive Gateway (XOR)', def: 'A branch decision gate where only one outgoing flow path is chosen based on a boolean condition (e.g., "Tests Pass?"). Represented by a diamond shape.' },
    { term: 'Sequence Flow', def: 'A solid connector arrow denoting the execution order of elements in a BPMN layout.' },
    { term: 'Token', def: 'A conceptual marker tracing the current location of process execution through the BPMN map.' }
  ],

  // Maps BPMN element IDs to descriptive content + linked role/artifact
  processElements: {
    'StartEvent_ReleaseTriggered': {
      title: 'Release Triggered',
      type: 'Start Event',
      desc: 'The release cycle starts when the feature development freeze date is reached or manual authorization triggers a release payload compile.',
      role: 'developer',
      artifact: 'release_branch'
    },
    'Task_CodeReview': {
      title: 'Code Review & PR Approval',
      type: 'User Task',
      desc: 'Peer developers review the incoming pull request code changes to ensure they match architectural constraints, standard practices, and PRD specifications.',
      role: 'developer',
      artifact: 'pull_request'
    },
    'Task_CIBuild': {
      title: 'Automated CI Build & Tests',
      type: 'Service Task',
      desc: 'The continuous integration server detects the branch merge, spawns a clean container image, compiles the code, and executes lint and unit test suites.',
      role: 'developer',
      artifact: 'pull_request'
    },
    'Gateway_TestsPass': {
      title: 'Tests Pass?',
      type: 'Exclusive Gateway',
      desc: 'Determines process flow based on unit/integration test results. If any critical test fails, the process diverts to bug-fixing; if all pass, it advances to Staging.',
      role: 'developer',
      artifact: 'pull_request'
    },
    'Task_FixBugs': {
      title: 'Fix Bugs & Commit',
      type: 'User Task',
      desc: 'Developers pick up the CI error trace, correct the source code, and commit a hotfix, which initiates a fresh validation loop.',
      role: 'developer',
      artifact: 'release_branch'
    },
    'Task_QAStaging': {
      title: 'Staging Deployment & QA',
      type: 'User Task',
      desc: 'Deployments are automatically rolled out to Staging. QA Engineers perform integration and exploratory runs, checking compatibility limits before drafting the test report.',
      role: 'qa_engineer',
      artifact: 'test_report'
    },
    'Task_ReleaseSignOff': {
      title: 'Release Sign-off',
      type: 'User Task',
      desc: 'The Release Manager reviews QA metrics, ticket statuses, and compliance documents, granting the final approval to release the build.',
      role: 'release_manager',
      artifact: 'test_report'
    },
    'Task_ProductionDeploy': {
      title: 'Production Deployment',
      type: 'Service Task',
      desc: 'Automated deployment orchestrators update production environments using canary distributions. System metrics and error logs are watched to assure stability.',
      role: 'release_manager',
      artifact: 'deployment_manifest'
    },
    'EndEvent_Deployed': {
      title: 'Release Deployed',
      type: 'End Event',
      desc: 'The code payload is fully active on Production and traffic routing is complete. The build now moves into long-term system health monitoring.',
      role: 'release_manager',
      artifact: 'deployment_manifest'
    }
  },

  // Embedded BPMN XML fallback (used when fetch() fails, e.g. file:// protocol)
  bpmnXML: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn"
                  exporter="bpmn-js (https://demo.bpmn.io)"
                  exporterVersion="17.11.1">
  <bpmn:process id="Process_SoftwareRelease" name="Software Release Cycle" isExecutable="false">
    <bpmn:startEvent id="StartEvent_ReleaseTriggered" name="Release Triggered">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_ReleaseTriggered" targetRef="Task_CodeReview" />
    <bpmn:userTask id="Task_CodeReview" name="Code Review &amp; PR Approval">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:incoming>Flow_FixLoop</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_CodeReview" targetRef="Task_CIBuild" />
    <bpmn:serviceTask id="Task_CIBuild" name="Automated CI Build &amp; Tests">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_CIBuild" targetRef="Gateway_TestsPass" />
    <bpmn:exclusiveGateway id="Gateway_TestsPass" name="Tests Pass?" default="Flow_TestsFailed">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_TestsFailed</bpmn:outgoing>
      <bpmn:outgoing>Flow_TestsPassed</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_TestsFailed" name="No" sourceRef="Gateway_TestsPass" targetRef="Task_FixBugs" />
    <bpmn:userTask id="Task_FixBugs" name="Fix Bugs &amp; Commit">
      <bpmn:incoming>Flow_TestsFailed</bpmn:incoming>
      <bpmn:outgoing>Flow_FixLoop</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_FixLoop" sourceRef="Task_FixBugs" targetRef="Task_CodeReview" />
    <bpmn:sequenceFlow id="Flow_TestsPassed" name="Yes" sourceRef="Gateway_TestsPass" targetRef="Task_QAStaging" />
    <bpmn:userTask id="Task_QAStaging" name="Staging Deployment &amp; QA Verification">
      <bpmn:incoming>Flow_TestsPassed</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_QAStaging" targetRef="Task_ReleaseSignOff" />
    <bpmn:userTask id="Task_ReleaseSignOff" name="Release Sign-off">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_ReleaseSignOff" targetRef="Task_ProductionDeploy" />
    <bpmn:serviceTask id="Task_ProductionDeploy" name="Production Deployment &amp; Verification">
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_ProductionDeploy" targetRef="EndEvent_Deployed" />
    <bpmn:endEvent id="EndEvent_Deployed" name="Release Deployed &amp; Monitored">
      <bpmn:incoming>Flow_6</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_SoftwareRelease">
    <bpmndi:BPMNPlane id="BPMNPlane_SoftwareRelease" bpmnElement="Process_SoftwareRelease">
      <bpmndi:BPMNShape id="Shape_StartEvent" bpmnElement="StartEvent_ReleaseTriggered">
        <dc:Bounds x="156" y="200" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="131" y="243" width="90" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_CodeReview" bpmnElement="Task_CodeReview">
        <dc:Bounds x="250" y="178" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_CIBuild" bpmnElement="Task_CIBuild">
        <dc:Bounds x="410" y="178" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_Gateway_TestsPass" bpmnElement="Gateway_TestsPass" isMarkerVisible="true">
        <dc:Bounds x="570" y="193" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="566" y="250" width="59" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_FixBugs" bpmnElement="Task_FixBugs">
        <dc:Bounds x="545" y="60" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_QAStaging" bpmnElement="Task_QAStaging">
        <dc:Bounds x="680" y="178" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_ReleaseSignOff" bpmnElement="Task_ReleaseSignOff">
        <dc:Bounds x="840" y="178" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_ProductionDeploy" bpmnElement="Task_ProductionDeploy">
        <dc:Bounds x="1000" y="178" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_EndEvent" bpmnElement="EndEvent_Deployed">
        <dc:Bounds x="1160" y="200" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1136" y="243" width="87" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Edge_Flow_1" bpmnElement="Flow_1">
        <di:waypoint x="192" y="218" />
        <di:waypoint x="250" y="218" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_2" bpmnElement="Flow_2">
        <di:waypoint x="350" y="218" />
        <di:waypoint x="410" y="218" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_3" bpmnElement="Flow_3">
        <di:waypoint x="510" y="218" />
        <di:waypoint x="570" y="218" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_TestsFailed" bpmnElement="Flow_TestsFailed">
        <di:waypoint x="595" y="193" />
        <di:waypoint x="595" y="140" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="602" y="164" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_FixLoop" bpmnElement="Flow_FixLoop">
        <di:waypoint x="545" y="100" />
        <di:waypoint x="300" y="100" />
        <di:waypoint x="300" y="178" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_TestsPassed" bpmnElement="Flow_TestsPassed">
        <di:waypoint x="620" y="218" />
        <di:waypoint x="680" y="218" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="641" y="200" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_4" bpmnElement="Flow_4">
        <di:waypoint x="780" y="218" />
        <di:waypoint x="840" y="218" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_5" bpmnElement="Flow_5">
        <di:waypoint x="940" y="218" />
        <di:waypoint x="1000" y="218" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_6" bpmnElement="Flow_6">
        <di:waypoint x="1100" y="218" />
        <di:waypoint x="1160" y="218" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,

  processFlow: [
    { id: 'StartEvent_ReleaseTriggered', label: 'Release Triggered', type: 'start' },
    { id: 'Task_CodeReview', label: 'Code Review & PR Approval', type: 'user-task' },
    { id: 'Task_CIBuild', label: 'CI Build & Tests', type: 'service-task' },
    { id: 'Gateway_TestsPass', label: 'Tests Pass?', type: 'gateway' },
    { id: 'Task_FixBugs', label: 'Fix Bugs & Commit', type: 'user-task', branch: 'failed' },
    { id: 'Task_QAStaging', label: 'Staging QA', type: 'user-task', branch: 'passed' },
    { id: 'Task_ReleaseSignOff', label: 'Release Sign-off', type: 'user-task' },
    { id: 'Task_ProductionDeploy', label: 'Production Deploy', type: 'service-task' },
    { id: 'EndEvent_Deployed', label: 'Deployed & Monitored', type: 'end' }
  ]

};
