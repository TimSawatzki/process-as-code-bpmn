// ============================================================
// Process-as-Code — Data Layer (Multi-Process)
// Shared roles, artifacts, glossary + 5 process definitions
// ============================================================

const ProcessData = {

  // ── Shared: Roles ─────────────────────────────────────────
  roles: [
    {
      id: 'developer', name: 'Developer', subtitle: 'Author & Refactor Code',
      icon: 'fa-code', color: '#38bdf8',
      desc: 'Translates product requirements into functional code, manages feature branches, initiates PRs, reviews peers, and fixes bugs.',
      responsibilities: [
        'Write modular, clean code that meets architecture specifications.',
        'Create feature branches and open Pull Requests for peer reviews.',
        'Review code from team members and recommend structural optimizations.',
        'Review test failure logs and staging reports to resolve bugs.'
      ],
      permissions: ['Write: feature branches, personal forks','Read: production repos, staging logs, CI pipelines'],
      touchpoints: [
        { step: 'Task_CodeReview', action: 'Submits pull request for peer review' },
        { step: 'Task_FixBugs', action: 'Picks up CI failures and deploys bugfixes' }
      ]
    },
    {
      id: 'product_manager', name: 'Product Manager', subtitle: 'Define Scope & Validate UX',
      icon: 'fa-clipboard-list', color: '#a78bfa',
      desc: 'Defines feature scopes, checks business logic alignment in technical reviews, verifies UX on Staging, and assists in release approvals.',
      responsibilities: [
        'Draft Product Requirement Documents (PRDs) detailing feature goals.',
        'Participate in code review meetings for high-priority user-facing tasks.',
        'Perform exploratory checkouts on the Staging environment to verify UX.',
        'Provide release readiness feedback to the Release Manager.'
      ],
      permissions: ['Read: codebase repos, PR descriptions, QA dashboards','Write: ticketing systems (Jira/Linear), project roadmaps'],
      touchpoints: [
        { step: 'Task_CodeReview', action: 'Reviews features for product alignment' },
        { step: 'Task_QAStaging', action: 'Checks visual and feature correctness' }
      ]
    },
    {
      id: 'qa_engineer', name: 'QA Engineer', subtitle: 'Assert Quality & Compliance',
      icon: 'fa-shield-halved', color: '#34d399',
      desc: 'Ensures code quality, authors regression test suites, inspects deployments, and compiles the official Test Report artifact.',
      responsibilities: [
        'Maintain, update, and trigger automated regression and E2E test suites.',
        'Conduct functional verification and environment tests on Staging.',
        'Log defects in the bug tracker with reproducible steps.',
        'Create and sign off on the Staging verification Test Report.'
      ],
      permissions: ['Write: QA testing frameworks, mock configs, bug trackers','Read: CI runners, build logs, staging infrastructure'],
      touchpoints: [{ step: 'Task_QAStaging', action: 'Main tester; runs test suites on Staging' }]
    },
    {
      id: 'release_manager', name: 'Release Manager', subtitle: 'Govern Releases & Infrastructure',
      icon: 'fa-rocket', color: '#fbbf24',
      desc: 'Controls release scheduling, ensures compliance checkboxes are met, performs final sign-offs, and oversees production rollouts.',
      responsibilities: [
        'Schedule release cycles and coordinate release payloads across departments.',
        'Verify all unit, integration, and security checks are completed and green.',
        'Approve production deployments and initiate the CD pipeline rollout.',
        'Coordinate rollback actions in the event of production deployment outages.'
      ],
      permissions: ['Write: release branch settings, build configuration files','Admin: CI/CD deployment jobs, production environment variables'],
      touchpoints: [
        { step: 'Task_ReleaseSignOff', action: 'Reviews Staging Test Report; approves build' },
        { step: 'Task_ProductionDeploy', action: 'Initiates and monitors production rollout' }
      ]
    },
    {
      id: 'security_engineer', name: 'Security Engineer', subtitle: 'Protect & Harden',
      icon: 'fa-lock', color: '#f87171',
      desc: 'Identifies vulnerabilities, conducts security reviews, runs penetration tests, and ensures patches meet compliance standards.',
      responsibilities: [
        'Conduct security code reviews for critical patches and features.',
        'Run automated and manual penetration tests on staging deployments.',
        'Assess vulnerability severity using CVSS scoring.',
        'Maintain security compliance documentation and audit trails.'
      ],
      permissions: ['Write: security scanning configs, firewall rules','Read: all repos, deployment logs, CVE databases'],
      touchpoints: [
        { step: 'Task_SecurityReview', action: 'Reviews patch code for security flaws' },
        { step: 'Task_PenTest', action: 'Runs penetration tests against staged patch' }
      ]
    },
    {
      id: 'sre', name: 'SRE / DevOps', subtitle: 'Reliability & Infrastructure',
      icon: 'fa-server', color: '#fb923c',
      desc: 'Monitors production health, responds to incidents, manages deployment pipelines, and ensures system reliability.',
      responsibilities: [
        'Monitor production telemetry and respond to alert escalations.',
        'Manage CI/CD pipelines and deployment automation.',
        'Diagnose production incidents and implement mitigations.',
        'Conduct post-mortems and drive reliability improvements.'
      ],
      permissions: ['Write: deployment pipelines, infrastructure config','Admin: production environment, monitoring dashboards'],
      touchpoints: [
        { step: 'Task_Diagnose', action: 'Diagnoses production incidents' },
        { step: 'Task_Mitigate', action: 'Implements emergency mitigations' }
      ]
    }
  ],

  // ── Shared: Artifacts ─────────────────────────────────────
  artifacts: [
    {
      id: 'pull_request', name: 'Pull Request (PR)', subtitle: 'Code Review Gatekeeper',
      icon: 'fa-code-pull-request', color: '#38bdf8',
      desc: 'A digital workspace where changes are discussed, reviewed by developers, and tested via automated CI pipelines before merging.',
      contents: ['Detailed description with ticket links','Diff highlights across files','CI checklist status','Review logs and approvals'],
      lifecycle: 'Opened → Reviewed → Merged into Release Branch',
      validation: 'Passing CI checks + minimum one peer review approval.'
    },
    {
      id: 'release_branch', name: 'Release Branch', subtitle: 'Stabilization Payload',
      icon: 'fa-code-branch', color: '#a78bfa',
      desc: 'A Git branch (release/v*.*.*) isolated from active development, used for release testing, version bumping, and hotfixing.',
      contents: ['Version tag (SemVer)','Merged release candidate commits','Package version config updates'],
      lifecycle: 'Created from integration → Frozen for QA → Merged to Main → Archived',
      validation: 'No direct commits. PR-only. Linear history required.'
    },
    {
      id: 'test_report', name: 'Test Report', subtitle: 'Quality Sign-off Document',
      icon: 'fa-file-shield', color: '#34d399',
      desc: 'A comprehensive document logging results of automated test suites and manual exploratory testing on Staging.',
      contents: ['Commit hash & timestamps','Pass/Fail analytics','Non-blocking defects','QA sign-off confirmation'],
      lifecycle: 'Generated after Staging → Attached to Release PR → Archived',
      validation: '100% automated pass rate + zero unresolved blocker bugs.'
    },
    {
      id: 'deployment_manifest', name: 'Deployment Manifest', subtitle: 'Infrastructure Config',
      icon: 'fa-file-lines', color: '#fbbf24',
      desc: 'Configuration charts (K8s, Terraform, Helm) specifying container images, environments, and networking rules.',
      contents: ['Docker registry paths & SHA hashes','Replication & resource specs','DB connections & secrets refs','Ingress & LB rules'],
      lifecycle: 'Managed in infra repo → Deployed in Staging → Applied in Production',
      validation: 'Infrastructure lints (kubeval) + CVE registry scans.'
    },
    {
      id: 'post_mortem', name: 'Post-Mortem Report', subtitle: 'Incident Retrospective',
      icon: 'fa-clipboard-question', color: '#f87171',
      desc: 'A blameless retrospective document analyzing root cause, impact, timeline, and action items from production incidents.',
      contents: ['Incident timeline (detection → resolution)','Root cause analysis','Customer impact assessment','Prevention action items'],
      lifecycle: 'Drafted post-incident → Reviewed by team → Stored in incident log',
      validation: 'Must include root cause and at least one preventative action item.'
    },
    {
      id: 'vulnerability_report', name: 'Vulnerability Report', subtitle: 'CVE Assessment',
      icon: 'fa-bug', color: '#f87171',
      desc: 'A security assessment document scoring the severity of a reported vulnerability and outlining the remediation plan.',
      contents: ['CVE ID & CVSS score','Affected components & versions','Exploitability analysis','Recommended patch timeline'],
      lifecycle: 'Created on report → Updated with fix → Closed after verification',
      validation: 'Must include CVSS v3.1 score and remediation deadline.'
    }
  ],

  // ── Shared: Glossary ──────────────────────────────────────
  glossary: [
    { term:'BPMN', def:'Business Process Model & Notation — an open graphical standard for modeling workflows.' },
    { term:'Process-as-Code', def:'Treating operational procedures, release paths, and policies as version-controlled code files.' },
    { term:'Start Event', def:'The trigger that initiates a BPMN process (thin border circle).' },
    { term:'End Event', def:'The final outcome state of a process (thick border circle).' },
    { term:'User Task', def:'A human-performed activity within the process (e.g., code review, QA testing).' },
    { term:'Service Task', def:'An activity executed by an automated system (e.g., CI builds, deployments).' },
    { term:'Exclusive Gateway (XOR)', def:'A decision gate where exactly one outgoing path is chosen based on a condition.' },
    { term:'Sequence Flow', def:'A solid arrow defining execution order between BPMN elements.' },
    { term:'CVSS', def:'Common Vulnerability Scoring System — a numerical score reflecting the severity of a security vulnerability.' },
    { term:'Post-Mortem', def:'A blameless retrospective analysis conducted after a production incident to identify root cause and prevent recurrence.' }
  ],

  // ── Processes ─────────────────────────────────────────────
  processes: [
    // ============================================================
    // Process 1: Software Release Cycle
    // ============================================================
    {
      id: 'software_release',
      name: 'Software Release Cycle',
      description: 'Standard enterprise release pipeline: code review, CI, staging QA, sign-off, and canary production deployment.',
      icon: 'fa-rocket', color: '#38bdf8',
      bpmnFile: 'processes/software_release_flow.bpmn',
      bpmnXML: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_SoftwareRelease" name="Software Release Cycle" isExecutable="false">
    <bpmn:startEvent id="StartEvent_ReleaseTriggered" name="Release Triggered"><bpmn:outgoing>Flow_1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_ReleaseTriggered" targetRef="Task_CodeReview"/>
    <bpmn:userTask id="Task_CodeReview" name="Code Review &amp; PR Approval"><bpmn:incoming>Flow_1</bpmn:incoming><bpmn:incoming>Flow_FixLoop</bpmn:incoming><bpmn:outgoing>Flow_2</bpmn:outgoing></bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_CodeReview" targetRef="Task_CIBuild"/>
    <bpmn:serviceTask id="Task_CIBuild" name="Automated CI Build &amp; Tests"><bpmn:incoming>Flow_2</bpmn:incoming><bpmn:outgoing>Flow_3</bpmn:outgoing></bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_CIBuild" targetRef="Gateway_TestsPass"/>
    <bpmn:exclusiveGateway id="Gateway_TestsPass" name="Tests Pass?" default="Flow_TestsFailed"><bpmn:incoming>Flow_3</bpmn:incoming><bpmn:outgoing>Flow_TestsFailed</bpmn:outgoing><bpmn:outgoing>Flow_TestsPassed</bpmn:outgoing></bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_TestsFailed" name="No" sourceRef="Gateway_TestsPass" targetRef="Task_FixBugs"/>
    <bpmn:userTask id="Task_FixBugs" name="Fix Bugs &amp; Commit"><bpmn:incoming>Flow_TestsFailed</bpmn:incoming><bpmn:outgoing>Flow_FixLoop</bpmn:outgoing></bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_FixLoop" sourceRef="Task_FixBugs" targetRef="Task_CodeReview"/>
    <bpmn:sequenceFlow id="Flow_TestsPassed" name="Yes" sourceRef="Gateway_TestsPass" targetRef="Task_QAStaging"/>
    <bpmn:userTask id="Task_QAStaging" name="Staging Deployment &amp; QA"><bpmn:incoming>Flow_TestsPassed</bpmn:incoming><bpmn:outgoing>Flow_4</bpmn:outgoing></bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_QAStaging" targetRef="Task_ReleaseSignOff"/>
    <bpmn:userTask id="Task_ReleaseSignOff" name="Release Sign-off"><bpmn:incoming>Flow_4</bpmn:incoming><bpmn:outgoing>Flow_5</bpmn:outgoing></bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_ReleaseSignOff" targetRef="Task_ProductionDeploy"/>
    <bpmn:serviceTask id="Task_ProductionDeploy" name="Production Deployment"><bpmn:incoming>Flow_5</bpmn:incoming><bpmn:outgoing>Flow_6</bpmn:outgoing></bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_ProductionDeploy" targetRef="EndEvent_Deployed"/>
    <bpmn:endEvent id="EndEvent_Deployed" name="Release Deployed"><bpmn:incoming>Flow_6</bpmn:incoming></bpmn:endEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_SoftwareRelease"><bpmndi:BPMNPlane id="BPMNPlane_SoftwareRelease" bpmnElement="Process_SoftwareRelease">
    <bpmndi:BPMNShape id="Shape_StartEvent" bpmnElement="StartEvent_ReleaseTriggered"><dc:Bounds x="156" y="200" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="131" y="243" width="90" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Shape_CodeReview" bpmnElement="Task_CodeReview"><dc:Bounds x="250" y="178" width="100" height="80"/></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Shape_CIBuild" bpmnElement="Task_CIBuild"><dc:Bounds x="410" y="178" width="100" height="80"/></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Shape_Gateway_TestsPass" bpmnElement="Gateway_TestsPass" isMarkerVisible="true"><dc:Bounds x="570" y="193" width="50" height="50"/><bpmndi:BPMNLabel><dc:Bounds x="566" y="250" width="59" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Shape_FixBugs" bpmnElement="Task_FixBugs"><dc:Bounds x="545" y="60" width="100" height="80"/></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Shape_QAStaging" bpmnElement="Task_QAStaging"><dc:Bounds x="680" y="178" width="100" height="80"/></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Shape_ReleaseSignOff" bpmnElement="Task_ReleaseSignOff"><dc:Bounds x="840" y="178" width="100" height="80"/></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Shape_ProductionDeploy" bpmnElement="Task_ProductionDeploy"><dc:Bounds x="1000" y="178" width="100" height="80"/></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Shape_EndEvent" bpmnElement="EndEvent_Deployed"><dc:Bounds x="1160" y="200" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="1136" y="243" width="87" height="27"/></bpmndi:BPMNLabel></bpmndi:BPMNShape>
    <bpmndi:BPMNEdge id="Edge_Flow_1" bpmnElement="Flow_1"><di:waypoint x="192" y="218"/><di:waypoint x="250" y="218"/></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Edge_Flow_2" bpmnElement="Flow_2"><di:waypoint x="350" y="218"/><di:waypoint x="410" y="218"/></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Edge_Flow_3" bpmnElement="Flow_3"><di:waypoint x="510" y="218"/><di:waypoint x="570" y="218"/></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Edge_Flow_TestsFailed" bpmnElement="Flow_TestsFailed"><di:waypoint x="595" y="193"/><di:waypoint x="595" y="140"/><bpmndi:BPMNLabel><dc:Bounds x="602" y="164" width="15" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Edge_Flow_FixLoop" bpmnElement="Flow_FixLoop"><di:waypoint x="545" y="100"/><di:waypoint x="300" y="100"/><di:waypoint x="300" y="178"/></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Edge_Flow_TestsPassed" bpmnElement="Flow_TestsPassed"><di:waypoint x="620" y="218"/><di:waypoint x="680" y="218"/><bpmndi:BPMNLabel><dc:Bounds x="641" y="200" width="18" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Edge_Flow_4" bpmnElement="Flow_4"><di:waypoint x="780" y="218"/><di:waypoint x="840" y="218"/></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Edge_Flow_5" bpmnElement="Flow_5"><di:waypoint x="940" y="218"/><di:waypoint x="1000" y="218"/></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Edge_Flow_6" bpmnElement="Flow_6"><di:waypoint x="1100" y="218"/><di:waypoint x="1160" y="218"/></bpmndi:BPMNEdge>
  </bpmndi:BPMNPlane></bpmndi:BPMNDiagram>
</bpmn:definitions>`,
      elements: {
        'StartEvent_ReleaseTriggered':{ title:'Release Triggered', type:'Start Event', desc:'The release cycle starts when feature development freeze is reached or manual authorization triggers a release payload.', role:'developer', artifact:'release_branch' },
        'Task_CodeReview':{ title:'Code Review & PR Approval', type:'User Task', desc:'Peer developers review incoming PR code changes to ensure they match architectural constraints and PRD specs.', role:'developer', artifact:'pull_request' },
        'Task_CIBuild':{ title:'CI Build & Tests', type:'Service Task', desc:'CI server spawns a clean container, compiles code, and executes lint and unit test suites.', role:'developer', artifact:'pull_request' },
        'Gateway_TestsPass':{ title:'Tests Pass?', type:'Exclusive Gateway', desc:'Routes based on test results. Failures divert to bug-fixing; passes advance to staging.', role:'developer', artifact:'pull_request' },
        'Task_FixBugs':{ title:'Fix Bugs & Commit', type:'User Task', desc:'Developers pick up CI error traces, correct source code, and commit hotfixes for re-validation.', role:'developer', artifact:'release_branch' },
        'Task_QAStaging':{ title:'Staging Deployment & QA', type:'User Task', desc:'Deployments roll out to Staging. QA runs integration and exploratory tests before drafting the test report.', role:'qa_engineer', artifact:'test_report' },
        'Task_ReleaseSignOff':{ title:'Release Sign-off', type:'User Task', desc:'Release Manager reviews QA metrics, ticket statuses, and compliance docs before granting final approval.', role:'release_manager', artifact:'test_report' },
        'Task_ProductionDeploy':{ title:'Production Deployment', type:'Service Task', desc:'Automated canary deployment to production. System metrics and error logs are monitored for stability.', role:'release_manager', artifact:'deployment_manifest' },
        'EndEvent_Deployed':{ title:'Release Deployed', type:'End Event', desc:'Payload is live on Production. The build enters long-term system health monitoring.', role:'release_manager', artifact:'deployment_manifest' }
      },
      flow: [
        { id:'StartEvent_ReleaseTriggered', label:'Release Triggered', type:'start' },
        { id:'Task_CodeReview', label:'Code Review & PR', type:'user-task' },
        { id:'Task_CIBuild', label:'CI Build & Tests', type:'service-task' },
        { id:'Gateway_TestsPass', label:'Tests Pass?', type:'gateway' },
        { id:'Task_FixBugs', label:'Fix Bugs', type:'user-task', branch:'failed' },
        { id:'Task_QAStaging', label:'Staging QA', type:'user-task', branch:'passed' },
        { id:'Task_ReleaseSignOff', label:'Sign-off', type:'user-task' },
        { id:'Task_ProductionDeploy', label:'Prod Deploy', type:'service-task' },
        { id:'EndEvent_Deployed', label:'Deployed', type:'end' }
      ]
    },

    // ============================================================
    // Process 2: Bug Triage & Resolution
    // ============================================================
    {
      id: 'bug_triage',
      name: 'Bug Triage & Resolution',
      description: 'How bugs are reported, triaged by severity, assigned to developers, fixed, reviewed, and verified by QA.',
      icon: 'fa-bug', color: '#f59e0b',
      bpmnFile: 'processes/bug_triage_flow.bpmn',
      bpmnXML: `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_BugTriage" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_BugTriage" name="Bug Triage &amp; Resolution" isExecutable="false"><bpmn:startEvent id="StartEvent_BugReported" name="Bug Reported"><bpmn:outgoing>Flow_BT1</bpmn:outgoing></bpmn:startEvent><bpmn:sequenceFlow id="Flow_BT1" sourceRef="StartEvent_BugReported" targetRef="Task_Triage"/><bpmn:userTask id="Task_Triage" name="Triage Bug"><bpmn:incoming>Flow_BT1</bpmn:incoming><bpmn:outgoing>Flow_BT2</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_BT2" sourceRef="Task_Triage" targetRef="Gateway_Severity"/><bpmn:exclusiveGateway id="Gateway_Severity" name="Critical?" default="Flow_BT_No"><bpmn:incoming>Flow_BT2</bpmn:incoming><bpmn:outgoing>Flow_BT_No</bpmn:outgoing><bpmn:outgoing>Flow_BT_Yes</bpmn:outgoing></bpmn:exclusiveGateway><bpmn:sequenceFlow id="Flow_BT_Yes" name="Yes" sourceRef="Gateway_Severity" targetRef="Task_AssignFix"/><bpmn:sequenceFlow id="Flow_BT_No" name="No" sourceRef="Gateway_Severity" targetRef="Task_Backlog"/><bpmn:userTask id="Task_AssignFix" name="Assign &amp; Fix"><bpmn:incoming>Flow_BT_Yes</bpmn:incoming><bpmn:outgoing>Flow_BT3</bpmn:outgoing></bpmn:userTask><bpmn:userTask id="Task_Backlog" name="Prioritize in Backlog"><bpmn:incoming>Flow_BT_No</bpmn:incoming><bpmn:outgoing>Flow_BT_BacklogEnd</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_BT3" sourceRef="Task_AssignFix" targetRef="Task_CodeReviewFix"/><bpmn:userTask id="Task_CodeReviewFix" name="Code Review Fix"><bpmn:incoming>Flow_BT3</bpmn:incoming><bpmn:outgoing>Flow_BT4</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_BT4" sourceRef="Task_CodeReviewFix" targetRef="Task_VerifyFix"/><bpmn:userTask id="Task_VerifyFix" name="QA Verify Fix"><bpmn:incoming>Flow_BT4</bpmn:incoming><bpmn:outgoing>Flow_BT5</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_BT5" sourceRef="Task_VerifyFix" targetRef="EndEvent_BugClosed"/><bpmn:sequenceFlow id="Flow_BT_BacklogEnd" sourceRef="Task_Backlog" targetRef="EndEvent_Scheduled"/><bpmn:endEvent id="EndEvent_BugClosed" name="Bug Closed"><bpmn:incoming>Flow_BT5</bpmn:incoming></bpmn:endEvent><bpmn:endEvent id="EndEvent_Scheduled" name="Scheduled"><bpmn:incoming>Flow_BT_BacklogEnd</bpmn:incoming></bpmn:endEvent></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_BugTriage"><bpmndi:BPMNPlane id="BPMNPlane_BugTriage" bpmnElement="Process_BugTriage"><bpmndi:BPMNShape id="Shape_BT_Start" bpmnElement="StartEvent_BugReported"><dc:Bounds x="150" y="120" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="128" y="163" width="80" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_BT_Triage" bpmnElement="Task_Triage"><dc:Bounds x="250" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_BT_Gateway" bpmnElement="Gateway_Severity" isMarkerVisible="true"><dc:Bounds x="410" y="113" width="50" height="50"/><bpmndi:BPMNLabel><dc:Bounds x="410" y="170" width="50" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_BT_AssignFix" bpmnElement="Task_AssignFix"><dc:Bounds x="520" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_BT_Backlog" bpmnElement="Task_Backlog"><dc:Bounds x="420" y="240" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_BT_CodeReview" bpmnElement="Task_CodeReviewFix"><dc:Bounds x="680" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_BT_Verify" bpmnElement="Task_VerifyFix"><dc:Bounds x="840" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_BT_EndClosed" bpmnElement="EndEvent_BugClosed"><dc:Bounds x="1000" y="120" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="980" y="163" width="70" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_BT_EndScheduled" bpmnElement="EndEvent_Scheduled"><dc:Bounds x="580" y="262" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="568" y="305" width="60" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Edge_BT1" bpmnElement="Flow_BT1"><di:waypoint x="186" y="138"/><di:waypoint x="250" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_BT2" bpmnElement="Flow_BT2"><di:waypoint x="350" y="138"/><di:waypoint x="410" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_BT_Yes" bpmnElement="Flow_BT_Yes"><di:waypoint x="460" y="138"/><di:waypoint x="520" y="138"/><bpmndi:BPMNLabel><dc:Bounds x="482" y="120" width="18" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_BT_No" bpmnElement="Flow_BT_No"><di:waypoint x="435" y="163"/><di:waypoint x="435" y="280"/><di:waypoint x="420" y="280"/><bpmndi:BPMNLabel><dc:Bounds x="442" y="218" width="15" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_BT3" bpmnElement="Flow_BT3"><di:waypoint x="620" y="138"/><di:waypoint x="680" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_BT4" bpmnElement="Flow_BT4"><di:waypoint x="780" y="138"/><di:waypoint x="840" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_BT5" bpmnElement="Flow_BT5"><di:waypoint x="940" y="138"/><di:waypoint x="1000" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_BT_BacklogEnd" bpmnElement="Flow_BT_BacklogEnd"><di:waypoint x="520" y="280"/><di:waypoint x="580" y="280"/></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`,
      elements: {
        'StartEvent_BugReported':{ title:'Bug Reported', type:'Start Event', desc:'A bug is reported via the issue tracker by a stakeholder, QA, or automated monitoring.', role:'qa_engineer', artifact:'pull_request' },
        'Task_Triage':{ title:'Triage Bug', type:'User Task', desc:'QA or PM reviews the bug report, reproduces the issue, and determines severity and priority.', role:'qa_engineer', artifact:'pull_request' },
        'Gateway_Severity':{ title:'Critical?', type:'Exclusive Gateway', desc:'Routes critical bugs (P0/P1) to immediate fix; non-critical bugs go to the backlog for sprint planning.', role:'qa_engineer', artifact:'pull_request' },
        'Task_AssignFix':{ title:'Assign & Fix', type:'User Task', desc:'Developer is assigned the bug, reproduces locally, writes a fix, and pushes a PR.', role:'developer', artifact:'pull_request' },
        'Task_Backlog':{ title:'Prioritize in Backlog', type:'User Task', desc:'Non-critical bug is added to the product backlog and prioritized for an upcoming sprint.', role:'product_manager', artifact:'pull_request' },
        'Task_CodeReviewFix':{ title:'Code Review Fix', type:'User Task', desc:'Peer developer reviews the bugfix PR for correctness, edge cases, and regression risk.', role:'developer', artifact:'pull_request' },
        'Task_VerifyFix':{ title:'QA Verify Fix', type:'User Task', desc:'QA engineer verifies the fix on a staging environment, runs regression tests, and confirms resolution.', role:'qa_engineer', artifact:'test_report' },
        'EndEvent_BugClosed':{ title:'Bug Closed', type:'End Event', desc:'Bug is verified as fixed and closed in the issue tracker.', role:'qa_engineer', artifact:'test_report' },
        'EndEvent_Scheduled':{ title:'Scheduled', type:'End Event', desc:'Bug is added to the backlog and will be addressed in a future sprint.', role:'product_manager', artifact:'pull_request' }
      },
      flow: [
        { id:'StartEvent_BugReported', label:'Bug Reported', type:'start' },
        { id:'Task_Triage', label:'Triage', type:'user-task' },
        { id:'Gateway_Severity', label:'Critical?', type:'gateway' },
        { id:'Task_Backlog', label:'Backlog', type:'user-task', branch:'no' },
        { id:'Task_AssignFix', label:'Assign & Fix', type:'user-task', branch:'yes' },
        { id:'Task_CodeReviewFix', label:'Code Review', type:'user-task' },
        { id:'Task_VerifyFix', label:'QA Verify', type:'user-task' },
        { id:'EndEvent_BugClosed', label:'Bug Closed', type:'end' }
      ]
    },

    // ============================================================
    // Process 3: Feature Development Lifecycle
    // ============================================================
    {
      id: 'feature_dev',
      name: 'Feature Development',
      description: 'End-to-end feature delivery: spec writing, design review, implementation, code review, QA, staging, and production deployment.',
      icon: 'fa-lightbulb', color: '#a78bfa',
      bpmnFile: 'processes/feature_dev_flow.bpmn',
      bpmnXML: `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_FeatureDev" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_FeatureDev" name="Feature Development Lifecycle" isExecutable="false"><bpmn:startEvent id="StartEvent_FeatureReq" name="Feature Requested"><bpmn:outgoing>Flow_FD1</bpmn:outgoing></bpmn:startEvent><bpmn:sequenceFlow id="Flow_FD1" sourceRef="StartEvent_FeatureReq" targetRef="Task_SpecWriting"/><bpmn:userTask id="Task_SpecWriting" name="Write Spec &amp; PRD"><bpmn:incoming>Flow_FD1</bpmn:incoming><bpmn:outgoing>Flow_FD2</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_FD2" sourceRef="Task_SpecWriting" targetRef="Task_DesignReview"/><bpmn:userTask id="Task_DesignReview" name="Design Review"><bpmn:incoming>Flow_FD2</bpmn:incoming><bpmn:outgoing>Flow_FD3</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_FD3" sourceRef="Task_DesignReview" targetRef="Gateway_DesignApproved"/><bpmn:exclusiveGateway id="Gateway_DesignApproved" name="Approved?" default="Flow_FD_Revise"><bpmn:incoming>Flow_FD3</bpmn:incoming><bpmn:outgoing>Flow_FD_Revise</bpmn:outgoing><bpmn:outgoing>Flow_FD_Yes</bpmn:outgoing></bpmn:exclusiveGateway><bpmn:sequenceFlow id="Flow_FD_Revise" name="Revise" sourceRef="Gateway_DesignApproved" targetRef="Task_SpecWriting"/><bpmn:sequenceFlow id="Flow_FD_Yes" name="Yes" sourceRef="Gateway_DesignApproved" targetRef="Task_Implementation"/><bpmn:userTask id="Task_Implementation" name="Implement Feature"><bpmn:incoming>Flow_FD_Yes</bpmn:incoming><bpmn:outgoing>Flow_FD4</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_FD4" sourceRef="Task_Implementation" targetRef="Task_CodeReview"/><bpmn:userTask id="Task_CodeReview" name="Peer Code Review"><bpmn:incoming>Flow_FD4</bpmn:incoming><bpmn:outgoing>Flow_FD5</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_FD5" sourceRef="Task_CodeReview" targetRef="Task_QATest"/><bpmn:userTask id="Task_QATest" name="QA Testing"><bpmn:incoming>Flow_FD5</bpmn:incoming><bpmn:outgoing>Flow_FD6</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_FD6" sourceRef="Task_QATest" targetRef="Task_StagingDeploy"/><bpmn:serviceTask id="Task_StagingDeploy" name="Deploy to Staging"><bpmn:incoming>Flow_FD6</bpmn:incoming><bpmn:outgoing>Flow_FD7</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="Flow_FD7" sourceRef="Task_StagingDeploy" targetRef="Task_ProdDeploy"/><bpmn:serviceTask id="Task_ProdDeploy" name="Deploy to Production"><bpmn:incoming>Flow_FD7</bpmn:incoming><bpmn:outgoing>Flow_FD8</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="Flow_FD8" sourceRef="Task_ProdDeploy" targetRef="EndEvent_FeatureLive"/><bpmn:endEvent id="EndEvent_FeatureLive" name="Feature Live"><bpmn:incoming>Flow_FD8</bpmn:incoming></bpmn:endEvent></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_FeatureDev"><bpmndi:BPMNPlane id="BPMNPlane_FeatureDev" bpmnElement="Process_FeatureDev"><bpmndi:BPMNShape id="Shape_FD_Start" bpmnElement="StartEvent_FeatureReq"><dc:Bounds x="150" y="120" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="120" y="163" width="100" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_Spec" bpmnElement="Task_SpecWriting"><dc:Bounds x="250" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_Design" bpmnElement="Task_DesignReview"><dc:Bounds x="410" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_Gateway" bpmnElement="Gateway_DesignApproved" isMarkerVisible="true"><dc:Bounds x="570" y="113" width="50" height="50"/><bpmndi:BPMNLabel><dc:Bounds x="562" y="170" width="66" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_Implement" bpmnElement="Task_Implementation"><dc:Bounds x="680" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_CodeReview" bpmnElement="Task_CodeReview"><dc:Bounds x="840" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_QATest" bpmnElement="Task_QATest"><dc:Bounds x="680" y="230" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_Staging" bpmnElement="Task_StagingDeploy"><dc:Bounds x="840" y="230" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_Prod" bpmnElement="Task_ProdDeploy"><dc:Bounds x="1000" y="230" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_FD_End" bpmnElement="EndEvent_FeatureLive"><dc:Bounds x="1160" y="252" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="1145" y="295" width="66" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Edge_FD1" bpmnElement="Flow_FD1"><di:waypoint x="186" y="138"/><di:waypoint x="250" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD2" bpmnElement="Flow_FD2"><di:waypoint x="350" y="138"/><di:waypoint x="410" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD3" bpmnElement="Flow_FD3"><di:waypoint x="510" y="138"/><di:waypoint x="570" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD_Yes" bpmnElement="Flow_FD_Yes"><di:waypoint x="620" y="138"/><di:waypoint x="680" y="138"/><bpmndi:BPMNLabel><dc:Bounds x="642" y="120" width="18" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD_Revise" bpmnElement="Flow_FD_Revise"><di:waypoint x="595" y="113"/><di:waypoint x="595" y="30"/><di:waypoint x="300" y="30"/><di:waypoint x="300" y="98"/><bpmndi:BPMNLabel><dc:Bounds x="455" y="12" width="36" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD4" bpmnElement="Flow_FD4"><di:waypoint x="780" y="138"/><di:waypoint x="840" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD5" bpmnElement="Flow_FD5"><di:waypoint x="890" y="178"/><di:waypoint x="890" y="230"/><di:waypoint x="780" y="230"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD6" bpmnElement="Flow_FD6"><di:waypoint x="780" y="270"/><di:waypoint x="840" y="270"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD7" bpmnElement="Flow_FD7"><di:waypoint x="940" y="270"/><di:waypoint x="1000" y="270"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_FD8" bpmnElement="Flow_FD8"><di:waypoint x="1100" y="270"/><di:waypoint x="1160" y="270"/></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`,
      elements: {
        'StartEvent_FeatureReq':{ title:'Feature Requested', type:'Start Event', desc:'A new feature is requested by product, stakeholders, or customers and enters the development pipeline.', role:'product_manager', artifact:'pull_request' },
        'Task_SpecWriting':{ title:'Write Spec & PRD', type:'User Task', desc:'Product Manager writes the Product Requirements Document detailing feature scope, acceptance criteria, and UX flows.', role:'product_manager', artifact:'pull_request' },
        'Task_DesignReview':{ title:'Design Review', type:'User Task', desc:'Engineering and design teams review the spec for technical feasibility, architecture impact, and UI consistency.', role:'developer', artifact:'pull_request' },
        'Gateway_DesignApproved':{ title:'Approved?', type:'Exclusive Gateway', desc:'If the design passes review, proceed to implementation. If not, return to spec writing for revisions.', role:'product_manager', artifact:'pull_request' },
        'Task_Implementation':{ title:'Implement Feature', type:'User Task', desc:'Developer implements the feature, writes unit tests, and opens a pull request.', role:'developer', artifact:'pull_request' },
        'Task_CodeReview':{ title:'Peer Code Review', type:'User Task', desc:'Peer developers review the implementation for correctness, style, and architectural alignment.', role:'developer', artifact:'pull_request' },
        'Task_QATest':{ title:'QA Testing', type:'User Task', desc:'QA engineer performs functional, integration, and exploratory testing on the feature branch build.', role:'qa_engineer', artifact:'test_report' },
        'Task_StagingDeploy':{ title:'Deploy to Staging', type:'Service Task', desc:'Automated pipeline deploys the feature to the staging environment for integration testing.', role:'developer', artifact:'deployment_manifest' },
        'Task_ProdDeploy':{ title:'Deploy to Production', type:'Service Task', desc:'Feature is deployed to production via canary or blue-green deployment strategy.', role:'release_manager', artifact:'deployment_manifest' },
        'EndEvent_FeatureLive':{ title:'Feature Live', type:'End Event', desc:'Feature is live in production and available to end users.', role:'release_manager', artifact:'deployment_manifest' }
      },
      flow: [
        { id:'StartEvent_FeatureReq', label:'Feature Request', type:'start' },
        { id:'Task_SpecWriting', label:'Spec & PRD', type:'user-task' },
        { id:'Task_DesignReview', label:'Design Review', type:'user-task' },
        { id:'Gateway_DesignApproved', label:'Approved?', type:'gateway' },
        { id:'Task_Implementation', label:'Implement', type:'user-task', branch:'yes' },
        { id:'Task_CodeReview', label:'Code Review', type:'user-task' },
        { id:'Task_QATest', label:'QA Test', type:'user-task' },
        { id:'Task_StagingDeploy', label:'Staging', type:'service-task' },
        { id:'Task_ProdDeploy', label:'Production', type:'service-task' },
        { id:'EndEvent_FeatureLive', label:'Live', type:'end' }
      ]
    },

    // ============================================================
    // Process 4: Incident Response
    // ============================================================
    {
      id: 'incident_response',
      name: 'Incident Response',
      description: 'Production incident handling: alert triage, diagnosis, mitigation, hotfix, emergency review, deployment, and post-mortem.',
      icon: 'fa-triangle-exclamation', color: '#ef4444',
      bpmnFile: 'processes/incident_response_flow.bpmn',
      bpmnXML: `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_Incident" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_IncidentResponse" name="Incident Response" isExecutable="false"><bpmn:startEvent id="StartEvent_Alert" name="Alert Triggered"><bpmn:outgoing>Flow_IR1</bpmn:outgoing></bpmn:startEvent><bpmn:sequenceFlow id="Flow_IR1" sourceRef="StartEvent_Alert" targetRef="Task_Diagnose"/><bpmn:userTask id="Task_Diagnose" name="Diagnose Issue"><bpmn:incoming>Flow_IR1</bpmn:incoming><bpmn:outgoing>Flow_IR2</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_IR2" sourceRef="Task_Diagnose" targetRef="Gateway_Severity"/><bpmn:exclusiveGateway id="Gateway_Severity" name="P0/P1?" default="Flow_IR_Minor"><bpmn:incoming>Flow_IR2</bpmn:incoming><bpmn:outgoing>Flow_IR_Minor</bpmn:outgoing><bpmn:outgoing>Flow_IR_Major</bpmn:outgoing></bpmn:exclusiveGateway><bpmn:sequenceFlow id="Flow_IR_Major" name="Yes" sourceRef="Gateway_Severity" targetRef="Task_Mitigate"/><bpmn:sequenceFlow id="Flow_IR_Minor" name="No" sourceRef="Gateway_Severity" targetRef="Task_LogTicket"/><bpmn:userTask id="Task_Mitigate" name="Mitigate &amp; Escalate"><bpmn:incoming>Flow_IR_Major</bpmn:incoming><bpmn:outgoing>Flow_IR3</bpmn:outgoing></bpmn:userTask><bpmn:userTask id="Task_LogTicket" name="Log Ticket"><bpmn:incoming>Flow_IR_Minor</bpmn:incoming><bpmn:outgoing>Flow_IR_MinorEnd</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_IR3" sourceRef="Task_Mitigate" targetRef="Task_Hotfix"/><bpmn:userTask id="Task_Hotfix" name="Develop Hotfix"><bpmn:incoming>Flow_IR3</bpmn:incoming><bpmn:outgoing>Flow_IR4</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_IR4" sourceRef="Task_Hotfix" targetRef="Task_EmergencyReview"/><bpmn:userTask id="Task_EmergencyReview" name="Emergency Review"><bpmn:incoming>Flow_IR4</bpmn:incoming><bpmn:outgoing>Flow_IR5</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_IR5" sourceRef="Task_EmergencyReview" targetRef="Task_DeployHotfix"/><bpmn:serviceTask id="Task_DeployHotfix" name="Deploy Hotfix"><bpmn:incoming>Flow_IR5</bpmn:incoming><bpmn:outgoing>Flow_IR6</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="Flow_IR6" sourceRef="Task_DeployHotfix" targetRef="Task_PostMortem"/><bpmn:userTask id="Task_PostMortem" name="Post-Mortem"><bpmn:incoming>Flow_IR6</bpmn:incoming><bpmn:outgoing>Flow_IR7</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_IR7" sourceRef="Task_PostMortem" targetRef="EndEvent_Resolved"/><bpmn:sequenceFlow id="Flow_IR_MinorEnd" sourceRef="Task_LogTicket" targetRef="EndEvent_Scheduled"/><bpmn:endEvent id="EndEvent_Resolved" name="Resolved"><bpmn:incoming>Flow_IR7</bpmn:incoming></bpmn:endEvent><bpmn:endEvent id="EndEvent_Scheduled" name="Scheduled"><bpmn:incoming>Flow_IR_MinorEnd</bpmn:incoming></bpmn:endEvent></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_Incident"><bpmndi:BPMNPlane id="BPMNPlane_Incident" bpmnElement="Process_IncidentResponse"><bpmndi:BPMNShape id="Shape_IR_Start" bpmnElement="StartEvent_Alert"><dc:Bounds x="150" y="120" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="128" y="163" width="80" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_Diagnose" bpmnElement="Task_Diagnose"><dc:Bounds x="250" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_Gateway" bpmnElement="Gateway_Severity" isMarkerVisible="true"><dc:Bounds x="410" y="113" width="50" height="50"/><bpmndi:BPMNLabel><dc:Bounds x="407" y="170" width="56" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_Mitigate" bpmnElement="Task_Mitigate"><dc:Bounds x="520" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_Ticket" bpmnElement="Task_LogTicket"><dc:Bounds x="420" y="240" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_Hotfix" bpmnElement="Task_Hotfix"><dc:Bounds x="680" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_Emergency" bpmnElement="Task_EmergencyReview"><dc:Bounds x="840" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_Deploy" bpmnElement="Task_DeployHotfix"><dc:Bounds x="1000" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_PostMortem" bpmnElement="Task_PostMortem"><dc:Bounds x="1160" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_EndResolved" bpmnElement="EndEvent_Resolved"><dc:Bounds x="1320" y="120" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="1310" y="163" width="56" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_IR_EndScheduled" bpmnElement="EndEvent_Scheduled"><dc:Bounds x="580" y="262" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="568" y="305" width="60" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Edge_IR1" bpmnElement="Flow_IR1"><di:waypoint x="186" y="138"/><di:waypoint x="250" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR2" bpmnElement="Flow_IR2"><di:waypoint x="350" y="138"/><di:waypoint x="410" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR_Major" bpmnElement="Flow_IR_Major"><di:waypoint x="460" y="138"/><di:waypoint x="520" y="138"/><bpmndi:BPMNLabel><dc:Bounds x="482" y="120" width="18" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR_Minor" bpmnElement="Flow_IR_Minor"><di:waypoint x="435" y="163"/><di:waypoint x="435" y="280"/><di:waypoint x="420" y="280"/><bpmndi:BPMNLabel><dc:Bounds x="442" y="218" width="15" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR3" bpmnElement="Flow_IR3"><di:waypoint x="620" y="138"/><di:waypoint x="680" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR4" bpmnElement="Flow_IR4"><di:waypoint x="780" y="138"/><di:waypoint x="840" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR5" bpmnElement="Flow_IR5"><di:waypoint x="940" y="138"/><di:waypoint x="1000" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR6" bpmnElement="Flow_IR6"><di:waypoint x="1100" y="138"/><di:waypoint x="1160" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR7" bpmnElement="Flow_IR7"><di:waypoint x="1260" y="138"/><di:waypoint x="1320" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_IR_MinorEnd" bpmnElement="Flow_IR_MinorEnd"><di:waypoint x="520" y="280"/><di:waypoint x="580" y="280"/></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`,
      elements: {
        'StartEvent_Alert':{ title:'Alert Triggered', type:'Start Event', desc:'A production monitoring alert fires, indicating degraded service, errors, or outage.', role:'sre', artifact:'post_mortem' },
        'Task_Diagnose':{ title:'Diagnose Issue', type:'User Task', desc:'SRE/DevOps investigates logs, metrics, and traces to identify the root cause and scope of impact.', role:'sre', artifact:'post_mortem' },
        'Gateway_Severity':{ title:'P0/P1?', type:'Exclusive Gateway', desc:'Determines if this is a critical (P0) or major (P1) incident requiring immediate response.', role:'sre', artifact:'post_mortem' },
        'Task_Mitigate':{ title:'Mitigate & Escalate', type:'User Task', desc:'SRE implements immediate mitigation (rollback, traffic shift, feature flag) and escalates to on-call developers.', role:'sre', artifact:'post_mortem' },
        'Task_LogTicket':{ title:'Log Ticket', type:'User Task', desc:'Non-critical issue is logged as a ticket for the next sprint — no immediate incident response needed.', role:'developer', artifact:'pull_request' },
        'Task_Hotfix':{ title:'Develop Hotfix', type:'User Task', desc:'Developer creates a hotfix branch, implements the fix, and opens an emergency PR.', role:'developer', artifact:'pull_request' },
        'Task_EmergencyReview':{ title:'Emergency Review', type:'User Task', desc:'Senior developer or lead performs an expedited but thorough review of the hotfix.', role:'developer', artifact:'pull_request' },
        'Task_DeployHotfix':{ title:'Deploy Hotfix', type:'Service Task', desc:'Hotfix is deployed to production through an expedited CI/CD pipeline with smoke tests.', role:'sre', artifact:'deployment_manifest' },
        'Task_PostMortem':{ title:'Post-Mortem', type:'User Task', desc:'Team conducts a blameless post-mortem: root cause analysis, timeline, impact assessment, and prevention actions.', role:'sre', artifact:'post_mortem' },
        'EndEvent_Resolved':{ title:'Resolved', type:'End Event', desc:'Incident is fully resolved, post-mortem is filed, and action items are tracked.', role:'sre', artifact:'post_mortem' },
        'EndEvent_Scheduled':{ title:'Scheduled', type:'End Event', desc:'Non-critical issue is scheduled for a future sprint.', role:'developer', artifact:'pull_request' }
      },
      flow: [
        { id:'StartEvent_Alert', label:'Alert', type:'start' },
        { id:'Task_Diagnose', label:'Diagnose', type:'user-task' },
        { id:'Gateway_Severity', label:'P0/P1?', type:'gateway' },
        { id:'Task_LogTicket', label:'Log Ticket', type:'user-task', branch:'no' },
        { id:'Task_Mitigate', label:'Mitigate', type:'user-task', branch:'yes' },
        { id:'Task_Hotfix', label:'Hotfix', type:'user-task' },
        { id:'Task_EmergencyReview', label:'Review', type:'user-task' },
        { id:'Task_DeployHotfix', label:'Deploy', type:'service-task' },
        { id:'Task_PostMortem', label:'Post-Mortem', type:'user-task' },
        { id:'EndEvent_Resolved', label:'Resolved', type:'end' }
      ]
    },

    // ============================================================
    // Process 5: Security Vulnerability Remediation
    // ============================================================
    {
      id: 'security_patch',
      name: 'Security Remediation',
      description: 'Vulnerability handling: CVSS assessment, patch development, security review, penetration testing, deployment, and verification.',
      icon: 'fa-shield-virus', color: '#10b981',
      bpmnFile: 'processes/security_vulnerability_flow.bpmn',
      bpmnXML: `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_Security" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_SecurityPatch" name="Security Vulnerability Remediation" isExecutable="false"><bpmn:startEvent id="StartEvent_VulnReported" name="Vulnerability Reported"><bpmn:outgoing>Flow_SV1</bpmn:outgoing></bpmn:startEvent><bpmn:sequenceFlow id="Flow_SV1" sourceRef="StartEvent_VulnReported" targetRef="Task_AssessSeverity"/><bpmn:userTask id="Task_AssessSeverity" name="Assess Severity (CVSS)"><bpmn:incoming>Flow_SV1</bpmn:incoming><bpmn:outgoing>Flow_SV2</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_SV2" sourceRef="Task_AssessSeverity" targetRef="Gateway_Critical"/><bpmn:exclusiveGateway id="Gateway_Critical" name="Critical?" default="Flow_SV_No"><bpmn:incoming>Flow_SV2</bpmn:incoming><bpmn:outgoing>Flow_SV_No</bpmn:outgoing><bpmn:outgoing>Flow_SV_Yes</bpmn:outgoing></bpmn:exclusiveGateway><bpmn:sequenceFlow id="Flow_SV_Yes" name="Yes" sourceRef="Gateway_Critical" targetRef="Task_DevelopPatch"/><bpmn:sequenceFlow id="Flow_SV_No" name="No" sourceRef="Gateway_Critical" targetRef="Task_SchedulePatch"/><bpmn:userTask id="Task_DevelopPatch" name="Develop Patch"><bpmn:incoming>Flow_SV_Yes</bpmn:incoming><bpmn:outgoing>Flow_SV3</bpmn:outgoing></bpmn:userTask><bpmn:userTask id="Task_SchedulePatch" name="Schedule in Sprint"><bpmn:incoming>Flow_SV_No</bpmn:incoming><bpmn:outgoing>Flow_SV_ScheduledEnd</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_SV3" sourceRef="Task_DevelopPatch" targetRef="Task_SecurityReview"/><bpmn:userTask id="Task_SecurityReview" name="Security Code Review"><bpmn:incoming>Flow_SV3</bpmn:incoming><bpmn:outgoing>Flow_SV4</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_SV4" sourceRef="Task_SecurityReview" targetRef="Task_PenTest"/><bpmn:serviceTask id="Task_PenTest" name="Penetration Test"><bpmn:incoming>Flow_SV4</bpmn:incoming><bpmn:outgoing>Flow_SV5</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="Flow_SV5" sourceRef="Task_PenTest" targetRef="Task_DeployPatch"/><bpmn:serviceTask id="Task_DeployPatch" name="Deploy Patch"><bpmn:incoming>Flow_SV5</bpmn:incoming><bpmn:outgoing>Flow_SV6</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="Flow_SV6" sourceRef="Task_DeployPatch" targetRef="Task_VerifyFix"/><bpmn:userTask id="Task_VerifyFix" name="Verify &amp; Monitor"><bpmn:incoming>Flow_SV6</bpmn:incoming><bpmn:outgoing>Flow_SV7</bpmn:outgoing></bpmn:userTask><bpmn:sequenceFlow id="Flow_SV7" sourceRef="Task_VerifyFix" targetRef="EndEvent_Remediated"/><bpmn:sequenceFlow id="Flow_SV_ScheduledEnd" sourceRef="Task_SchedulePatch" targetRef="EndEvent_Scheduled"/><bpmn:endEvent id="EndEvent_Remediated" name="Remediated"><bpmn:incoming>Flow_SV7</bpmn:incoming></bpmn:endEvent><bpmn:endEvent id="EndEvent_Scheduled" name="Scheduled"><bpmn:incoming>Flow_SV_ScheduledEnd</bpmn:incoming></bpmn:endEvent></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_Security"><bpmndi:BPMNPlane id="BPMNPlane_Security" bpmnElement="Process_SecurityPatch"><bpmndi:BPMNShape id="Shape_SV_Start" bpmnElement="StartEvent_VulnReported"><dc:Bounds x="150" y="120" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="110" y="163" width="115" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_Assess" bpmnElement="Task_AssessSeverity"><dc:Bounds x="250" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_Gateway" bpmnElement="Gateway_Critical" isMarkerVisible="true"><dc:Bounds x="410" y="113" width="50" height="50"/><bpmndi:BPMNLabel><dc:Bounds x="407" y="170" width="56" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_Develop" bpmnElement="Task_DevelopPatch"><dc:Bounds x="520" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_Schedule" bpmnElement="Task_SchedulePatch"><dc:Bounds x="420" y="240" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_SecReview" bpmnElement="Task_SecurityReview"><dc:Bounds x="680" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_PenTest" bpmnElement="Task_PenTest"><dc:Bounds x="840" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_Deploy" bpmnElement="Task_DeployPatch"><dc:Bounds x="1000" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_Verify" bpmnElement="Task_VerifyFix"><dc:Bounds x="1160" y="98" width="100" height="80"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_EndRemediated" bpmnElement="EndEvent_Remediated"><dc:Bounds x="1320" y="120" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="1300" y="163" width="75" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Shape_SV_EndScheduled" bpmnElement="EndEvent_Scheduled"><dc:Bounds x="580" y="262" width="36" height="36"/><bpmndi:BPMNLabel><dc:Bounds x="568" y="305" width="60" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Edge_SV1" bpmnElement="Flow_SV1"><di:waypoint x="186" y="138"/><di:waypoint x="250" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV2" bpmnElement="Flow_SV2"><di:waypoint x="350" y="138"/><di:waypoint x="410" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV_Yes" bpmnElement="Flow_SV_Yes"><di:waypoint x="460" y="138"/><di:waypoint x="520" y="138"/><bpmndi:BPMNLabel><dc:Bounds x="482" y="120" width="18" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV_No" bpmnElement="Flow_SV_No"><di:waypoint x="435" y="163"/><di:waypoint x="435" y="280"/><di:waypoint x="420" y="280"/><bpmndi:BPMNLabel><dc:Bounds x="442" y="218" width="15" height="14"/></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV3" bpmnElement="Flow_SV3"><di:waypoint x="620" y="138"/><di:waypoint x="680" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV4" bpmnElement="Flow_SV4"><di:waypoint x="780" y="138"/><di:waypoint x="840" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV5" bpmnElement="Flow_SV5"><di:waypoint x="940" y="138"/><di:waypoint x="1000" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV6" bpmnElement="Flow_SV6"><di:waypoint x="1100" y="138"/><di:waypoint x="1160" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV7" bpmnElement="Flow_SV7"><di:waypoint x="1260" y="138"/><di:waypoint x="1320" y="138"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Edge_SV_ScheduledEnd" bpmnElement="Flow_SV_ScheduledEnd"><di:waypoint x="520" y="280"/><di:waypoint x="580" y="280"/></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`,
      elements: {
        'StartEvent_VulnReported':{ title:'Vulnerability Reported', type:'Start Event', desc:'A security vulnerability is reported via CVE disclosure, bug bounty, or internal security scan.', role:'security_engineer', artifact:'vulnerability_report' },
        'Task_AssessSeverity':{ title:'Assess Severity (CVSS)', type:'User Task', desc:'Security engineer evaluates the vulnerability using CVSS v3.1 scoring: base, temporal, and environmental metrics.', role:'security_engineer', artifact:'vulnerability_report' },
        'Gateway_Critical':{ title:'Critical?', type:'Exclusive Gateway', desc:'Critical (CVSS 9.0+) or High (7.0+) vulnerabilities require immediate patching. Lower severities are scheduled.', role:'security_engineer', artifact:'vulnerability_report' },
        'Task_DevelopPatch':{ title:'Develop Patch', type:'User Task', desc:'Developer implements the security patch following secure coding guidelines and OWASP recommendations.', role:'developer', artifact:'pull_request' },
        'Task_SchedulePatch':{ title:'Schedule in Sprint', type:'User Task', desc:'Lower-severity vulnerability is added to the team backlog for a regular sprint cycle.', role:'developer', artifact:'vulnerability_report' },
        'Task_SecurityReview':{ title:'Security Code Review', type:'User Task', desc:'Security engineer performs a focused code review of the patch for exploit mitigation and compliance.', role:'security_engineer', artifact:'pull_request' },
        'Task_PenTest':{ title:'Penetration Test', type:'Service Task', desc:'Automated security scanners and manual pen-testing validate that the vulnerability is fully remediated.', role:'security_engineer', artifact:'test_report' },
        'Task_DeployPatch':{ title:'Deploy Patch', type:'Service Task', desc:'Security patch is deployed to production through the standard CI/CD pipeline with additional security gates.', role:'sre', artifact:'deployment_manifest' },
        'Task_VerifyFix':{ title:'Verify & Monitor', type:'User Task', desc:'Security engineer verifies the fix in production and monitors for any regression or exploitation attempts.', role:'security_engineer', artifact:'vulnerability_report' },
        'EndEvent_Remediated':{ title:'Remediated', type:'End Event', desc:'Vulnerability is fully remediated, verified, and the CVE report is closed.', role:'security_engineer', artifact:'vulnerability_report' },
        'EndEvent_Scheduled':{ title:'Scheduled', type:'End Event', desc:'Vulnerability patch is scheduled for a future sprint.', role:'developer', artifact:'vulnerability_report' }
      },
      flow: [
        { id:'StartEvent_VulnReported', label:'Vuln Reported', type:'start' },
        { id:'Task_AssessSeverity', label:'CVSS Assess', type:'user-task' },
        { id:'Gateway_Critical', label:'Critical?', type:'gateway' },
        { id:'Task_SchedulePatch', label:'Schedule', type:'user-task', branch:'no' },
        { id:'Task_DevelopPatch', label:'Develop Patch', type:'user-task', branch:'yes' },
        { id:'Task_SecurityReview', label:'Sec Review', type:'user-task' },
        { id:'Task_PenTest', label:'Pen Test', type:'service-task' },
        { id:'Task_DeployPatch', label:'Deploy', type:'service-task' },
        { id:'Task_VerifyFix', label:'Verify', type:'user-task' },
        { id:'EndEvent_Remediated', label:'Remediated', type:'end' }
      ]
    }
  ],

  // Helper: get a process by ID
  getProcess(id) {
    return this.processes.find(p => p.id === id);
  }
};
