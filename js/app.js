// ============================================================
// Process-as-Code — Application Controller
// ============================================================

;(function () {
  'use strict';

  // ---- State ----
  const state = {
    activeView: 'dashboard',
    bpmnViewer: null,
    bpmnReady: false,
    sidebarOpen: false
  };

  // ---- DOM Cache ----
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const dom = {
    sidebar: $('.sidebar'),
    menuToggle: $('#menu-toggle'),
    navLinks: $$('.nav-link'),
    views: $$('.view'),
    topbarTitle: $('#topbar-title'),
    searchInput: $('#search-input'),
    modalOverlay: $('#modal-overlay'),
    modalTitle: $('#modal-title'),
    modalBody: $('#modal-body'),
    modalClose: $('#modal-close'),
    statsGrid: $('#stats-grid'),
    processFlow: $('#process-flow'),
    rolesGrid: $('#roles-grid'),
    artifactsGrid: $('#artifacts-grid'),
    glossaryList: $('#glossary-list'),
    bpmnCanvas: $('#bpmn-canvas'),
    btnResetZoom: $('#btn-reset-zoom')
  };

  // ---- Init ----
  function init() {
    renderDashboard();
    renderRoles(ProcessData.roles);
    renderArtifacts(ProcessData.artifacts);
    renderGlossary(ProcessData.glossary);
    bindNavigation();
    bindSearch();
    bindModal();
    bindMenuToggle();
  }

  // ============================================================
  //  NAVIGATION
  // ============================================================
  function bindNavigation() {
    dom.navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const view = link.dataset.view;
        navigateTo(view);
      });
    });
  }

  function navigateTo(view) {
    state.activeView = view;

    // Update nav
    dom.navLinks.forEach(l => l.classList.remove('active'));
    const activeLink = $(`.nav-link[data-view="${view}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update title
    const titleText = activeLink ? activeLink.textContent.trim() : view;
    dom.topbarTitle.textContent = titleText;

    // Toggle views
    dom.views.forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${view}`);
    if (target) target.classList.add('active');

    // Clear search
    dom.searchInput.value = '';
    filterContent('');

    // Close mobile sidebar
    closeSidebar();

    // Init BPMN viewer lazily
    if (view === 'bpmn' && !state.bpmnReady) {
      initBpmnViewer();
    } else if (view === 'bpmn' && state.bpmnViewer) {
      setTimeout(() => fitBpmnViewport(), 150);
    }
  }

  function bindMenuToggle() {
    dom.menuToggle.addEventListener('click', () => {
      state.sidebarOpen ? closeSidebar() : openSidebar();
    });
    // Close sidebar when clicking outside
    document.addEventListener('click', e => {
      if (state.sidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('#menu-toggle')) {
        closeSidebar();
      }
    });
  }

  function openSidebar() {
    state.sidebarOpen = true;
    dom.sidebar.classList.add('open');
  }
  function closeSidebar() {
    state.sidebarOpen = false;
    dom.sidebar.classList.remove('open');
  }

  // ============================================================
  //  SEARCH
  // ============================================================
  function bindSearch() {
    dom.searchInput.addEventListener('input', e => {
      filterContent(e.target.value.toLowerCase().trim());
    });
  }

  function filterContent(query) {
    renderRoles(query ? ProcessData.roles.filter(r => matchRole(r, query)) : ProcessData.roles);
    renderArtifacts(query ? ProcessData.artifacts.filter(a => matchArtifact(a, query)) : ProcessData.artifacts);
    renderGlossary(query ? ProcessData.glossary.filter(g => matchGlossary(g, query)) : ProcessData.glossary);
  }

  function matchRole(r, q) {
    return r.name.toLowerCase().includes(q) ||
           r.subtitle.toLowerCase().includes(q) ||
           r.desc.toLowerCase().includes(q) ||
           r.responsibilities.some(x => x.toLowerCase().includes(q));
  }
  function matchArtifact(a, q) {
    return a.name.toLowerCase().includes(q) ||
           a.subtitle.toLowerCase().includes(q) ||
           a.desc.toLowerCase().includes(q) ||
           a.contents.some(x => x.toLowerCase().includes(q));
  }
  function matchGlossary(g, q) {
    return g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q);
  }

  // ============================================================
  //  DASHBOARD
  // ============================================================
  function renderDashboard() {
    // Stats
    dom.statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon accent"><i class="fa-solid fa-arrows-spin"></i></div>
        <div><div class="stat-value">${ProcessData.stats.processes}</div><div class="stat-label">Active Processes</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success"><i class="fa-solid fa-users-gear"></i></div>
        <div><div class="stat-value">${ProcessData.stats.roles}</div><div class="stat-label">Process Roles</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning"><i class="fa-solid fa-boxes-stacked"></i></div>
        <div><div class="stat-value">${ProcessData.stats.artifacts}</div><div class="stat-label">Outputs & Artifacts</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple"><i class="fa-solid fa-list-check"></i></div>
        <div><div class="stat-value">${ProcessData.stats.steps}</div><div class="stat-label">Process Steps</div></div>
      </div>
    `;

    // Process flow mini-map
    dom.processFlow.innerHTML = buildProcessFlowHTML();
    // Bind click on flow nodes
    $$('.flow-node', dom.processFlow).forEach(node => {
      node.addEventListener('click', () => {
        const elId = node.dataset.elementId;
        const elData = ProcessData.processElements[elId];
        if (elData) showElementDetail(elId, elData);
      });
    });
  }

  function buildProcessFlowHTML() {
    const steps = ProcessData.processFlow;
    let html = '';
    let prevWasGateway = false;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const isBranch = !!step.branch;

      if (i > 0 && !isBranch) {
        html += `<div class="flow-arrow"><i class="fa-solid fa-chevron-right"></i></div>`;
      }

      if (step.branch === 'failed') {
        html += `<div class="flow-branch-label">No — loop back</div>`;
      }
      if (step.branch === 'passed') {
        html += `<div class="flow-branch-label">Yes</div>`;
      }

      const iconMap = {
        'start': 'fa-play',
        'end': 'fa-flag-checkered',
        'user-task': 'fa-user',
        'service-task': 'fa-gear',
        'gateway': 'fa-diamond'
      };

      html += `
        <div class="flow-node" data-element-id="${step.id}">
          <div class="flow-node-icon ${step.type}">
            <i class="fa-solid ${iconMap[step.type] || 'fa-circle'}"></i>
          </div>
          <span class="flow-node-label">${step.label}</span>
        </div>
      `;
    }

    return html;
  }

  // ============================================================
  //  ROLES VIEW
  // ============================================================
  function renderRoles(roles) {
    if (!dom.rolesGrid) return;
    if (roles.length === 0) {
      dom.rolesGrid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-users-slash"></i><p>No matching roles</p></div>';
      return;
    }

    dom.rolesGrid.innerHTML = roles.map(r => `
      <div class="card" data-role="${r.id}">
        <div class="card-badge" style="color:${r.color}">${r.subtitle}</div>
        <div class="card-title">
          <i class="fa-solid ${r.icon}" style="color:${r.color}"></i>
          ${r.name}
        </div>
        <div class="card-desc">${r.desc}</div>
      </div>
    `).join('');

    $$('.card[data-role]', dom.rolesGrid).forEach(card => {
      card.addEventListener('click', () => {
        const role = ProcessData.roles.find(r => r.id === card.dataset.role);
        if (role) showRoleDetail(role);
      });
    });
  }

  // ============================================================
  //  ARTIFACTS VIEW
  // ============================================================
  function renderArtifacts(artifacts) {
    if (!dom.artifactsGrid) return;
    if (artifacts.length === 0) {
      dom.artifactsGrid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-box-open"></i><p>No matching artifacts</p></div>';
      return;
    }

    dom.artifactsGrid.innerHTML = artifacts.map(a => `
      <div class="card" data-artifact="${a.id}">
        <div class="card-badge" style="color:${a.color}">${a.subtitle}</div>
        <div class="card-title">
          <i class="fa-solid ${a.icon}" style="color:${a.color}"></i>
          ${a.name}
        </div>
        <div class="card-desc">${a.desc}</div>
      </div>
    `).join('');

    $$('.card[data-artifact]', dom.artifactsGrid).forEach(card => {
      card.addEventListener('click', () => {
        const art = ProcessData.artifacts.find(a => a.id === card.dataset.artifact);
        if (art) showArtifactDetail(art);
      });
    });
  }

  // ============================================================
  //  GLOSSARY VIEW
  // ============================================================
  function renderGlossary(items) {
    if (!dom.glossaryList) return;
    if (items.length === 0) {
      dom.glossaryList.innerHTML = '<div class="empty-state"><i class="fa-solid fa-book-open"></i><p>No matching terms</p></div>';
      return;
    }

    dom.glossaryList.innerHTML = items.map(g => `
      <div class="glossary-item">
        <i class="fa-solid fa-bookmark"></i>
        <div>
          <h4>${g.term}</h4>
          <p>${g.def}</p>
        </div>
      </div>
    `).join('');
  }

  // ============================================================
  //  MODAL
  // ============================================================
  function bindModal() {
    dom.modalClose.addEventListener('click', closeModal);
    dom.modalOverlay.addEventListener('click', e => {
      if (e.target === dom.modalOverlay) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && dom.modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function openModal(title, html) {
    dom.modalTitle.textContent = title;
    dom.modalBody.innerHTML = html;
    dom.modalOverlay.classList.add('active');
  }

  function closeModal() {
    dom.modalOverlay.classList.remove('active');
  }

  function showRoleDetail(role) {
    const html = `
      <div class="modal-section">
        <div class="modal-section-label">Role</div>
        <p style="font-weight:600;font-size:1.05rem;color:${role.color};margin-bottom:4px;">
          <i class="fa-solid ${role.icon}"></i> ${role.subtitle}
        </p>
        <p style="color:var(--text-secondary);font-size:0.9rem;">${role.desc}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Key Responsibilities</div>
        <ul>${role.responsibilities.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Permissions</div>
        <ul>${role.permissions.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Process Touchpoints</div>
        <ul>
          ${role.touchpoints.map(t => {
            const el = ProcessData.processElements[t.step];
            return `<li><strong>${el ? el.title : t.step}</strong> — ${t.action}</li>`;
          }).join('')}
        </ul>
      </div>
    `;
    openModal(role.name, html);
  }

  function showArtifactDetail(art) {
    const html = `
      <div class="modal-section">
        <div class="modal-section-label">Artifact</div>
        <p style="font-weight:600;font-size:1.05rem;color:${art.color};margin-bottom:4px;">
          <i class="fa-solid ${art.icon}"></i> ${art.subtitle}
        </p>
        <p style="color:var(--text-secondary);font-size:0.9rem;">${art.desc}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Contents & Parameters</div>
        <ul>${art.contents.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Lifecycle</div>
        <p style="color:var(--text-secondary);font-size:0.9rem;">${art.lifecycle}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Validation</div>
        <p style="color:var(--text-secondary);font-size:0.9rem;">${art.validation}</p>
      </div>
    `;
    openModal(art.name, html);
  }

  function showElementDetail(elId, data) {
    const role = ProcessData.roles.find(r => r.id === data.role);
    const artifact = ProcessData.artifacts.find(a => a.id === data.artifact);

    const linkedHTML = (role || artifact) ? `
      <div class="modal-section">
        <div class="modal-section-label">Linked Resources</div>
        <div class="modal-linked">
          ${role ? `
            <div class="modal-link-card" data-action="show-role" data-id="${role.id}">
              <i class="fa-solid ${role.icon}" style="color:${role.color};font-size:1.2rem;"></i>
              <div>
                <div style="font-size:0.7rem;color:var(--text-tertiary);">Role</div>
                <div style="font-weight:600;font-size:0.9rem;">${role.name}</div>
              </div>
            </div>
          ` : ''}
          ${artifact ? `
            <div class="modal-link-card" data-action="show-artifact" data-id="${artifact.id}">
              <i class="fa-solid ${artifact.icon}" style="color:${artifact.color};font-size:1.2rem;"></i>
              <div>
                <div style="font-size:0.7rem;color:var(--text-tertiary);">Artifact</div>
                <div style="font-weight:600;font-size:0.9rem;">${artifact.name}</div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    ` : '';

    const html = `
      <div class="modal-section">
        <div class="modal-section-label">Element Type</div>
        <p style="font-weight:600;font-size:1rem;color:var(--accent);">
          <i class="fa-solid fa-diagram-project"></i> ${data.type}
        </p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Description</div>
        <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;">${data.desc}</p>
      </div>
      ${linkedHTML}
    `;
    openModal(data.title, html);

    // Bind linked card clicks
    setTimeout(() => {
      $$('.modal-link-card').forEach(card => {
        card.addEventListener('click', () => {
          closeModal();
          const action = card.dataset.action;
          const id = card.dataset.id;
          setTimeout(() => {
            if (action === 'show-role') {
              const r = ProcessData.roles.find(x => x.id === id);
              if (r) showRoleDetail(r);
            } else if (action === 'show-artifact') {
              const a = ProcessData.artifacts.find(x => x.id === id);
              if (a) showArtifactDetail(a);
            }
          }, 200);
        });
      });
    }, 50);
  }

  // ============================================================
  //  BPMN VIEWER
  // ============================================================
  async function initBpmnViewer() {
    if (typeof BpmnJS === 'undefined') {
      dom.bpmnCanvas.innerHTML = `
        <div class="empty-state" style="height:100%;">
          <i class="fa-solid fa-cloud-bolt" style="color:var(--danger);"></i>
          <h3 style="color:var(--danger);margin-bottom:8px;">BPMN Library Unavailable</h3>
          <p>bpmn-js failed to load from CDN. Check your internet connection.</p>
        </div>`;
      return;
    }

    // Show loading
    dom.bpmnCanvas.innerHTML = `
      <div class="loading-state" style="height:100%;">
        <i class="fa-solid fa-spinner"></i>
        <p>Loading BPMN diagram…</p>
      </div>`;

    try {
      // Load BPMN XML: try fetching the .bpmn file on HTTP servers,
      // use the embedded fallback on file:// or if fetch fails.
      let bpmnXML;

      if (window.location.protocol === 'file:') {
        // file:// protocol — fetch() would hang, use embedded XML directly
        bpmnXML = ProcessData.bpmnXML;
      } else {
        // HTTP(S) — try fetch with a short timeout, fall back to embedded
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          const response = await fetch('processes/software_release_flow.bpmn', { signal: controller.signal });
          clearTimeout(timeout);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          bpmnXML = await response.text();
        } catch {
          bpmnXML = ProcessData.bpmnXML;
        }
      }

      // Clear the loading spinner before bpmn-js appends its own container
      dom.bpmnCanvas.innerHTML = '';

      // Create viewer
      state.bpmnViewer = new BpmnJS({
        container: dom.bpmnCanvas,
        keyboard: { bindTo: window }
      });

      await state.bpmnViewer.importXML(bpmnXML);

      const canvas = state.bpmnViewer.get('canvas');
      const eventBus = state.bpmnViewer.get('eventBus');

      // Fit to viewport
      canvas.zoom('fit-viewport');

      // Click handler
      eventBus.on('element.click', e => {
        const data = ProcessData.processElements[e.element.id];
        if (data) showElementDetail(e.element.id, data);
      });

      // Hover highlights
      eventBus.on('element.hover', e => {
        if (ProcessData.processElements[e.element.id]) {
          canvas.addMarker(e.element.id, 'highlight');
        }
      });
      eventBus.on('element.out', e => {
        canvas.removeMarker(e.element.id, 'highlight');
      });

      // Reset zoom button
      dom.btnResetZoom.addEventListener('click', () => canvas.zoom('fit-viewport'));

      state.bpmnReady = true;

    } catch (err) {
      console.error('BPMN init error:', err);
      dom.bpmnCanvas.innerHTML = `
        <div class="empty-state" style="height:100%;">
          <i class="fa-solid fa-circle-exclamation" style="color:var(--danger);"></i>
          <h3 style="color:var(--danger);margin-bottom:8px;">Failed to Load Diagram</h3>
          <p>${err.message || 'Could not parse BPMN XML.'}</p>
        </div>`;
    }
  }

  function fitBpmnViewport() {
    if (!state.bpmnViewer) return;
    try {
      const canvas = state.bpmnViewer.get('canvas');
      canvas.resized();
      canvas.zoom('fit-viewport');
    } catch (e) {
      console.error('BPMN fit error:', e);
    }
  }

  // ---- Boot ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
