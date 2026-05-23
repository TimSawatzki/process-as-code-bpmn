// Process-as-Code BPMN Portal Application Controller

// 1. Data Store
const DATA = {
  roles: [
    {
      id: 'developer',
      name: 'Developer',
      subtitle: 'Author & Refactor Code',
      icon: 'fa-user-code',
      desc: 'Translates product requirements into functional code, manages feature branches, initiates PRs, reviews peers, and fixes bugs.',
      responsibilities: [
        'Write modular, clean code that meets architecture specifications.',
        'Create feature branches and open Pull Requests for peer reviews.',
        'Review code from team members and recommend structural optimizations.',
        'Review test failure logs and staging reports to resolve bugs.'
      ],
      access: [
        'Write permissions for feature branches and personal forks.',
        'Read permissions for production repositories, staging logs, and CI pipelines.'
      ],
      touchpoints: [
        'Code Review & PR Approval (Task_CodeReview): Submits pull request.',
        'Fix Bugs & Commit (Task_FixBugs): Picks up issues and deploys bugfixes.'
      ]
    },
    {
      id: 'product_manager',
      name: 'Product Manager',
      subtitle: 'Define Scope & Validate UX',
      icon: 'fa-user-tie',
      desc: 'Defines feature scopes, checks business logic alignment in technical reviews, verifies UX on Staging, and assists in release approvals.',
      responsibilities: [
        'Draft Product Requirement Documents (PRDs) detailing feature goals.',
        'Participate in code review meetings for high-priority user-facing tasks.',
        'Perform exploratory checkouts on the Staging environment to verify UX.',
        'Provide release readiness feedback to the Release Manager.'
      ],
      access: [
        'Read access to codebase repositories, PR descriptions, and QA dashboards.',
        'Write access to ticketing systems (Jira/Linear) and project roadmaps.'
      ],
      touchpoints: [
        'Code Review & PR Approval (Task_CodeReview): Reviews features for product alignment.',
        'Staging Deployment & QA Verification (Task_QAStaging): Checks visual and feature correctness.'
      ]
    },
    {
      id: 'qa_engineer',
      name: 'QA Engineer',
      subtitle: 'Assert Quality & Compliance',
      icon: 'fa-user-shield',
      desc: 'Ensures code quality, authors regression test suites, inspects deployments, and compiles the official Test Report artifact.',
      responsibilities: [
        'Maintain, update, and trigger automated regression and E2E test suites.',
        'Conduct functional verification and environment tests on Staging.',
        'Log defects in the bug tracker with reproducible steps.',
        'Create and sign off on the Staging verification Test Report.'
      ],
      access: [
        'Write access to QA testing frameworks, mock configurations, and bug systems.',
        'Read access to CI runners, build logs, and staging environment infrastructure.'
      ],
      touchpoints: [
        'Staging Deployment & QA Verification (Task_QAStaging): Main tester; runs test suites.'
      ]
    },
    {
      id: 'release_manager',
      name: 'Release Manager',
      subtitle: 'Govern Releases & Infrastructure',
      icon: 'fa-user-gear',
      desc: 'Controls release scheduling, ensures compliance checkboxes are met, performs final sign-offs, and oversees production rollouts.',
      responsibilities: [
        'Schedule release cycles and coordinate release payloads across departments.',
        'Verify that all unit, integration, and security checks are completed and green.',
        'Approve production deployments and initiate the CD pipeline rollout.',
        'Coordinate rollback actions in the event of production deployment outages.'
      ],
      access: [
        'Write access to release branch settings and build configuration files.',
        'Admin permissions on CI/CD deployment jobs and production environment variables.'
      ],
      touchpoints: [
        'Release Sign-off (Task_ReleaseSignOff): Reviews Staging Test Report and approves production build.',
        'Production Deployment (Task_ProductionDeploy): Initiates and monitors rollout.'
      ]
    }
  ],
  
  artifacts: [
    {
      id: 'pull_request',
      name: 'Pull Request (PR)',
      subtitle: 'Code Review Gatekeeper',
      icon: 'fa-code-pull-request',
      desc: 'A digital workspace where changes are discussed, reviewed by developers, and tested via automated CI pipelines before merging.',
      contents: [
        'Detailed description of changes and links to ticketing platforms.',
        'Diff highlights illustrating modifications across files.',
        'Automated CI checklist status (Linter, Unit Tests, Security scan).',
        'Developer review logs and formal approval markings.'
      ],
      lifecycle: 'Opened by Developer -> Reviewed & Checked by Team -> Merged into Release Branch.',
      validation: 'Requires passing CI build checks and a minimum of one peer review approval.'
    },
    {
      id: 'release_branch',
      name: 'Release Branch',
      subtitle: 'Stabilization payload branch',
      icon: 'fa-git-branch',
      desc: 'A Git branch (release/v*.*.*) isolated from active development, used strictly for release testing, version bumping, and final hotfixing.',
      contents: [
        'Version tag (Semantic Versioning compliance).',
        'Merged release candidate payload commits.',
        'Repository version configuration updates (e.g., package.json).'
      ],
      lifecycle: 'Created from integration branch -> Frozen for Staging QA -> Merged to Main/Prod after sign-off -> Archived.',
      validation: 'Direct commits blocked. Commits must be made via PR. Requires linear history.'
    },
    {
      id: 'test_report',
      name: 'Test Report',
      subtitle: 'Quality Sign-off Document',
      icon: 'fa-file-shield',
      desc: 'A comprehensive document logging the results of automated test suites and manual exploratory testing on Staging.',
      contents: [
        'Target commit hash and deployment execution timestamps.',
        'Pass/Fail analytics for unit, API, integration, and E2E checks.',
        'Overview of non-blocking defects discovered.',
        'QA sign-off confirmation statement.'
      ],
      lifecycle: 'Generated after Staging verification -> Attached to Release PR -> Archived in audit log.',
      validation: 'Requires 100% automated test pass rate and zero unresolved blocker bugs (P0/P1).'
    },
    {
      id: 'deployment_manifest',
      name: 'Deployment Manifest',
      subtitle: 'Infrastructure Configuration',
      icon: 'fa-file-lines',
      desc: 'Configuration charts (Kubernetes, Terraform, Helm) that specify container image IDs, runtime environments, and networking rules for production.',
      contents: [
        'Docker registry paths and SHA hashes for deployed containers.',
        'Replication parameters, memory allocations, CPU specifications.',
        'Database connections and credentials vault endpoints.',
        'Ingress load balancer mapping rules.'
      ],
      lifecycle: 'Managed in infrastructure repository -> Deployed in Staging -> Applied during Production Release.',
      validation: 'Validated via infrastructure lints (e.g. kubeval) and CVE container registry scans.'
    }
  ],
  
  glossary: [
    {
      term: 'BPMN (Business Process Model & Notation)',
      desc: 'An open graphical standard used to model and map workflows. Facilitates smooth communication between engineering, product, and operations.'
    },
    {
      term: 'Process-as-Code',
      desc: 'Treating operational guidelines, release paths, and infrastructure policies as standard code files. Enables auditing, automation, and Git version control.'
    },
    {
      term: 'Start Event',
      desc: 'The starting trigger of a BPMN process diagram (represented by a thin border circle). In our system, this is the Feature Complete milestone.'
    },
    {
      term: 'End Event',
      desc: 'The final outcome state of a process (represented by a thick border circle). Indicates completion of the process goals.'
    },
    {
      term: 'Task / Activity',
      desc: 'An action representing work performed. User Tasks are human activities, while Service Tasks are automated software services.'
    },
    {
      term: 'Exclusive Gateway (XOR)',
      desc: 'A branch decision gate in a workflow where only one outgoing flow path is chosen based on a boolean condition (e.g. "Tests Pass?").'
    },
    {
      term: 'Sequence Flow',
      desc: 'A solid connector arrow denoting the execution order of elements in a BPMN layout.'
    },
    {
      term: 'Token',
      desc: 'A conceptual marker tracing the current location of process execution through the BPMN map.'
    }
  ]
};

// Map BPMN process elements to descriptive content blocks
const PROCESS_ELEMENTS_MAP = {
  'StartEvent_ReleaseTriggered': {
    title: 'Process Initiator: Release Triggered',
    type: 'Start Event',
    desc: 'The release cycle starts when the feature development freeze date is reached or manual authorization triggers a release payload compile.',
    linkedRole: 'developer',
    linkedArtifact: 'release_branch'
  },
  'Task_CodeReview': {
    title: 'Code Review & PR Approval',
    type: 'User Task',
    desc: 'Peer developers review the incoming pull request code changes to ensure they match architectural constraints, standard practices, and PRD specifications.',
    linkedRole: 'developer',
    linkedArtifact: 'pull_request'
  },
  'Task_CIBuild': {
    title: 'Automated CI Build & Tests',
    type: 'Service Task',
    desc: 'The continuous integration server detects the branch merge, spawns a clean container image, compiles the code, and executes lint and unit test suites.',
    linkedRole: 'developer',
    linkedArtifact: 'pull_request'
  },
  'Gateway_TestsPass': {
    title: 'Gateway: Tests Pass?',
    type: 'Exclusive Gateway',
    desc: 'Determines process flow based on unit/integration test results. If any critical test fails, the process diverts to bug-fixing; if all pass, it advances to Staging.',
    linkedRole: 'developer',
    linkedArtifact: 'pull_request'
  },
  'Task_FixBugs': {
    title: 'Fix Bugs & Commit',
    type: 'User Task',
    desc: 'Developers pick up the CI error trace, correct the source code, and commit a hotfix, which initiates a fresh validation loop.',
    linkedRole: 'developer',
    linkedArtifact: 'release_branch'
  },
  'Task_QAStaging': {
    title: 'Staging Deployment & QA Verification',
    type: 'User Task',
    desc: 'Deployments are automatically rolled out to Staging. QA Engineers perform integration and exploratory runs, checking compatibility limits before drafting the test report.',
    linkedRole: 'qa_engineer',
    linkedArtifact: 'test_report'
  },
  'Task_ReleaseSignOff': {
    title: 'Release Sign-off',
    type: 'User Task',
    desc: 'The Release Manager reviews QA metrics, ticket statuses, and compliance documents, granting the final approval code to release the build.',
    linkedRole: 'release_manager',
    linkedArtifact: 'test_report'
  },
  'Task_ProductionDeploy': {
    title: 'Production Deployment & Verification',
    type: 'Service Task',
    desc: 'Automated deployment orchestrators update production environments using canary distributions. System metrics and error logs are watched to assure stability.',
    linkedRole: 'release_manager',
    linkedArtifact: 'deployment_manifest'
  },
  'EndEvent_Deployed': {
    title: 'End State: Release Deployed',
    type: 'End Event',
    desc: 'The code payload is fully active on Production and traffic routing is complete. The build now moves into the long-term system health monitoring phase.',
    linkedRole: 'release_manager',
    linkedArtifact: 'deployment_manifest'
  }
};

// 2. DOM Elements
const elements = {
  navItems: document.querySelectorAll('.nav-item'),
  views: document.querySelectorAll('.view-container'),
  pageTitle: document.getElementById('page-title-text'),
  searchInput: document.getElementById('search-input'),
  rolesGrid: document.getElementById('roles-grid'),
  artifactsGrid: document.getElementById('artifacts-grid'),
  glossaryList: document.getElementById('glossary-list'),
  modal: document.getElementById('detail-modal'),
  modalTitle: document.getElementById('modal-title-text'),
  modalBody: document.getElementById('modal-body-content'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  resetDiagramBtn: document.getElementById('btn-reset-diagram')
};

// 3. Application State
let activeView = 'dashboard';
let bpmnViewer = null;

// 4. Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  renderRolesList(DATA.roles);
  renderArtifactsList(DATA.artifacts);
  renderGlossaryList(DATA.glossary);
  setupSearch();
  setupModal();
  initBPMNViewer();
});

// 5. Navigation Controller
function setupNavigation() {
  elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = item.getAttribute('data-view');
      
      // Update sidebar styling
      elements.navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      
      // Toggle views
      elements.views.forEach(v => v.classList.remove('active'));
      const activeViewEl = document.getElementById(`view-${viewName}`);
      if (activeViewEl) {
        activeViewEl.classList.add('active');
      }
      
      // Update top header text
      activeView = viewName;
      const titleText = item.textContent.trim();
      elements.pageTitle.textContent = titleText;
      
      // Clear search when switching tabs to avoid confusion
      elements.searchInput.value = '';
      filterContent('');
      
      // If switching to BPMN view, fit the diagram in the viewport
      if (viewName === 'bpmn' && bpmnViewer) {
        setTimeout(() => {
          try {
            const canvas = bpmnViewer.get('canvas');
            canvas.resized();
            canvas.zoom('fit-viewport');
          } catch (e) {
            console.error('BPMN fit viewport error:', e);
          }
        }, 100);
      }
    });
  });
}

// 6. Data Rendering Functions
function renderRolesList(roles) {
  elements.rolesGrid.innerHTML = '';
  if (roles.length === 0) {
    elements.rolesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No matching roles found.</div>';
    return;
  }
  
  roles.forEach(role => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div>
          <span class="card-subtitle">${role.subtitle}</span>
          <h3 class="card-title">${role.name}</h3>
        </div>
        <i class="fa-solid ${role.icon}" style="font-size: 1.5rem; color: var(--primary-color);"></i>
      </div>
      <p class="card-desc">${role.desc}</p>
    `;
    card.addEventListener('click', () => showRoleDetail(role));
    elements.rolesGrid.appendChild(card);
  });
}

function renderArtifactsList(artifacts) {
  elements.artifactsGrid.innerHTML = '';
  if (artifacts.length === 0) {
    elements.artifactsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No matching artifacts found.</div>';
    return;
  }
  
  artifacts.forEach(art => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div>
          <span class="card-subtitle">${art.subtitle}</span>
          <h3 class="card-title">${art.name}</h3>
        </div>
        <i class="fa-solid ${art.icon}" style="font-size: 1.5rem; color: var(--primary-color);"></i>
      </div>
      <p class="card-desc">${art.desc}</p>
    `;
    card.addEventListener('click', () => showArtifactDetail(art));
    elements.artifactsGrid.appendChild(card);
  });
}

function renderGlossaryList(glossary) {
  elements.glossaryList.innerHTML = '';
  if (glossary.length === 0) {
    elements.glossaryList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 12px;">No matching glossary terms found.</div>';
    return;
  }
  
  glossary.forEach(item => {
    const div = document.createElement('div');
    div.className = 'guide-item';
    div.style.alignItems = 'flex-start';
    div.innerHTML = `
      <i class="fa-solid fa-bookmark" style="color: var(--primary-color); margin-top: 4px;"></i>
      <div>
        <strong style="display: block; font-size: 1rem; color: var(--text-main); margin-bottom: 4px;">${item.term}</strong>
        <span style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">${item.desc}</span>
      </div>
    `;
    elements.glossaryList.appendChild(div);
  });
}

// 7. Search Controller
function setupSearch() {
  elements.searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    filterContent(query);
  });
}

function filterContent(query) {
  // If activeView is dashboard or bpmn, we allow searching globally and filter dashboard guide items
  if (activeView === 'dashboard') {
    const items = document.querySelectorAll('#view-dashboard .guide-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Filter Roles
  const filteredRoles = DATA.roles.filter(role => 
    role.name.toLowerCase().includes(query) || 
    role.subtitle.toLowerCase().includes(query) || 
    role.desc.toLowerCase().includes(query) ||
    role.responsibilities.some(r => r.toLowerCase().includes(query))
  );
  renderRolesList(filteredRoles);

  // Filter Artifacts
  const filteredArtifacts = DATA.artifacts.filter(art => 
    art.name.toLowerCase().includes(query) || 
    art.subtitle.toLowerCase().includes(query) || 
    art.desc.toLowerCase().includes(query) ||
    art.contents.some(c => c.toLowerCase().includes(query))
  );
  renderArtifactsList(filteredArtifacts);

  // Filter Glossary
  const filteredGlossary = DATA.glossary.filter(item => 
    item.term.toLowerCase().includes(query) || 
    item.desc.toLowerCase().includes(query)
  );
  renderGlossaryList(filteredGlossary);
}

// 8. Modal Manager
function setupModal() {
  const closeModal = () => {
    elements.modal.classList.remove('active');
  };
  
  elements.modalCloseBtn.addEventListener('click', closeModal);
  elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
  });
  
  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function showModal(title, bodyHTML) {
  elements.modalTitle.textContent = title;
  elements.modalBody.innerHTML = bodyHTML;
  elements.modal.classList.add('active');
}

function showRoleDetail(role) {
  const html = `
    <div class="modal-section">
      <div class="modal-section-title">Description</div>
      <p style="color: var(--text-main); font-weight: 500; font-size: 1.05rem; margin-bottom: 8px;">${role.subtitle}</p>
      <p>${role.desc}</p>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Key Responsibilities</div>
      <ul style="color: var(--text-muted);">
        ${role.responsibilities.map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join('')}
      </ul>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Access Boundaries</div>
      <ul style="color: var(--text-muted);">
        ${role.access.map(a => `<li style="margin-bottom: 6px;">${a}</li>`).join('')}
      </ul>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Process Map Intersections</div>
      <ul style="color: var(--text-muted);">
        ${role.touchpoints.map(t => `<li style="margin-bottom: 6px;">${t}</li>`).join('')}
      </ul>
    </div>
  `;
  showModal(role.name, html);
}

function showArtifactDetail(art) {
  const html = `
    <div class="modal-section">
      <div class="modal-section-title">Description</div>
      <p style="color: var(--text-main); font-weight: 500; font-size: 1.05rem; margin-bottom: 8px;">${art.subtitle}</p>
      <p>${art.desc}</p>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Contents & Parameters</div>
      <ul style="color: var(--text-muted);">
        ${art.contents.map(c => `<li style="margin-bottom: 6px;">${c}</li>`).join('')}
      </ul>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Repository Lifecycle</div>
      <p style="color: var(--text-muted);">${art.lifecycle}</p>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Automated Checks / Validation</div>
      <p style="color: var(--text-muted);">${art.validation}</p>
    </div>
  `;
  showModal(art.name, html);
}

// 9. BPMN Viewer Integration
function initBPMNViewer() {
  if (typeof BpmnJS === 'undefined') {
    console.error('BPMN-JS library failed to load from unpkg CDN. Make sure you are online.');
    document.getElementById('canvas').innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--danger-color); padding: 32px; text-align: center;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 16px;"></i>
        <h3>BPMN Viewer CDN Unreachable</h3>
        <p style="color: var(--text-muted); margin-top: 8px; font-size: 0.9rem;">
          The bpmn-js rendering library is loaded from unpkg.com. Please verify your internet connection or launch a local web server.
        </p>
      </div>
    `;
    return;
  }

  // Initialize BpmnJS Viewer instance
  bpmnViewer = new BpmnJS({
    container: '#canvas',
    keyboard: {
      bindTo: window
    }
  });

  // Import local embedded XML
  bpmnViewer.importXML(BPMN_XML)
    .then(() => {
      const canvas = bpmnViewer.get('canvas');
      canvas.zoom('fit-viewport');
      
      // Wire event listeners
      const eventBus = bpmnViewer.get('eventBus');
      
      eventBus.on('element.click', (event) => {
        const { element } = event;
        handleElementClick(element);
      });
      
      // Apply clean hover styles to shapes
      eventBus.on('element.hover', (event) => {
        const { element } = event;
        if (PROCESS_ELEMENTS_MAP[element.id]) {
          canvas.addMarker(element.id, 'highlight');
        }
      });

      eventBus.on('element.out', (event) => {
        const { element } = event;
        canvas.removeMarker(element.id, 'highlight');
      });

      // Wire zoom reset button
      elements.resetDiagramBtn.addEventListener('click', () => {
        canvas.zoom('fit-viewport');
      });
    })
    .catch((err) => {
      console.error('BPMN Import Error:', err);
      document.getElementById('canvas').innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--danger-color); padding: 32px;">
          <i class="fa-solid fa-circle-xmark" style="font-size: 3rem; margin-bottom: 16px;"></i>
          <h3>Failed to Import BPMN Diagram</h3>
          <p style="color: var(--text-muted); margin-top: 8px;">Check that the XML format is valid.</p>
        </div>
      `;
    });
}

// 10. Click Handler for BPMN Shapes
function handleElementClick(element) {
  const data = PROCESS_ELEMENTS_MAP[element.id];
  if (!data) return; // Ignore elements not mapped (like sequence flows or background labels)
  
  // Find linked Role & Artifact Objects
  const roleObj = DATA.roles.find(r => r.id === data.linkedRole);
  const artifactObj = DATA.artifacts.find(a => a.id === data.linkedArtifact);
  
  const html = `
    <div class="modal-section">
      <div class="modal-section-title">Element Type</div>
      <p style="color: var(--text-main); font-weight: 600;">
        <i class="fa-solid fa-square-poll-horizontal" style="color: var(--primary-color); margin-right: 6px;"></i>
        ${data.type}
      </p>
    </div>
    
    <div class="modal-section">
      <div class="modal-section-title">Operational Description</div>
      <p style="color: var(--text-main);">${data.desc}</p>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;" class="modal-section">
      ${roleObj ? `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; cursor: pointer; hover: border-color: var(--primary-color);" onclick="window.showLinkedRole('${roleObj.id}')">
          <div class="modal-section-title" style="margin-bottom: 4px; font-size: 0.75rem;">Linked Role</div>
          <strong style="color: var(--primary-color); display: flex; align-items: center; gap: 6px; font-size: 0.95rem;">
            <i class="fa-solid ${roleObj.icon}"></i> ${roleObj.name}
          </strong>
        </div>
      ` : ''}
      
      ${artifactObj ? `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; cursor: pointer;" onclick="window.showLinkedArtifact('${artifactObj.id}')">
          <div class="modal-section-title" style="margin-bottom: 4px; font-size: 0.75rem;">Linked Output</div>
          <strong style="color: var(--primary-color); display: flex; align-items: center; gap: 6px; font-size: 0.95rem;">
            <i class="fa-solid ${artifactObj.icon}"></i> ${artifactObj.name}
          </strong>
        </div>
      ` : ''}
    </div>
  `;
  
  // Expose triggers globally for inline click navigation inside modal
  window.showLinkedRole = (roleId) => {
    elements.modal.classList.remove('active');
    const role = DATA.roles.find(r => r.id === roleId);
    if (role) setTimeout(() => showRoleDetail(role), 200);
  };
  
  window.showLinkedArtifact = (artId) => {
    elements.modal.classList.remove('active');
    const art = DATA.artifacts.find(a => a.id === artId);
    if (art) setTimeout(() => showArtifactDetail(art), 200);
  };
  
  showModal(data.title, html);
}
