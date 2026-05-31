// ============================================================
// Process-as-Code — Multi-Process Application Controller
// ============================================================

;(function () {
  'use strict';

  const state = {
    activeView: 'dashboard',
    activeProcessId: 'software_release',
    bpmnViewer: null,
    bpmnReady: false,
    sidebarOpen: false
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

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
    processCardsGrid: $('#process-cards-grid'),
    rolesGrid: $('#roles-grid'),
    artifactsGrid: $('#artifacts-grid'),
    glossaryList: $('#glossary-list'),
    bpmnCanvas: $('#bpmn-canvas'),
    processSelector: $('#process-selector'),
    btnResetZoom: $('#btn-reset-zoom'),
    badgeRoles: $('#badge-roles'),
    badgeArtifacts: $('#badge-artifacts')
  };

  // ── Init ──────────────────────────────────────────────────
  function init() {
    dom.badgeRoles.textContent = ProcessData.roles.length;
    dom.badgeArtifacts.textContent = ProcessData.artifacts.length;
    renderDashboard();
    renderRoles(ProcessData.roles);
    renderArtifacts(ProcessData.artifacts);
    renderGlossary(ProcessData.glossary);
    renderProcessSelector();
    bindNavigation();
    bindSearch();
    bindModal();
    bindMenuToggle();
    bindProcessSelector();
  }

  // ── Navigation ────────────────────────────────────────────
  function bindNavigation() {
    dom.navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(link.dataset.view);
      });
    });
  }

  function navigateTo(view) {
    state.activeView = view;
    dom.navLinks.forEach(l => l.classList.remove('active'));
    const activeLink = $(`.nav-link[data-view="${view}"]`);
    if (activeLink) activeLink.classList.add('active');
    dom.topbarTitle.textContent = activeLink ? activeLink.textContent.replace(/\d/g,'').trim() : view;
    dom.views.forEach(v => v.classList.remove('active'));
    const t = document.getElementById(`view-${view}`);
    if (t) t.classList.add('active');
    dom.searchInput.value = '';
    filterContent('');
    closeSidebar();
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
    document.addEventListener('click', e => {
      if (state.sidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('#menu-toggle')) {
        closeSidebar();
      }
    });
  }
  function openSidebar() { state.sidebarOpen = true; dom.sidebar.classList.add('open'); }
  function closeSidebar() { state.sidebarOpen = false; dom.sidebar.classList.remove('open'); }

  // ── Search ────────────────────────────────────────────────
  function bindSearch() {
    dom.searchInput.addEventListener('input', e => filterContent(e.target.value.toLowerCase().trim()));
  }
  function filterContent(q) {
    renderRoles(q ? ProcessData.roles.filter(r => matchRole(r,q)) : ProcessData.roles);
    renderArtifacts(q ? ProcessData.artifacts.filter(a => matchArtifact(a,q)) : ProcessData.artifacts);
    renderGlossary(q ? ProcessData.glossary.filter(g => matchGlossary(g,q)) : ProcessData.glossary);
  }
  function matchRole(r,q) { return (r.name+r.subtitle+r.desc+r.responsibilities.join('')).toLowerCase().includes(q); }
  function matchArtifact(a,q) { return (a.name+a.subtitle+a.desc+a.contents.join('')).toLowerCase().includes(q); }
  function matchGlossary(g,q) { return (g.term+g.def).toLowerCase().includes(q); }

  // ── Dashboard ─────────────────────────────────────────────
  function renderDashboard() {
    const totalSteps = ProcessData.processes.reduce((s,p) => s + p.flow.length, 0);
    dom.statsGrid.innerHTML = `
      <div class="stat-card"><div class="stat-icon accent"><i class="fa-solid fa-arrows-spin"></i></div><div><div class="stat-value">${ProcessData.processes.length}</div><div class="stat-label">Active Processes</div></div></div>
      <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-users-gear"></i></div><div><div class="stat-value">${ProcessData.roles.length}</div><div class="stat-label">Process Roles</div></div></div>
      <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-boxes-stacked"></i></div><div><div class="stat-value">${ProcessData.artifacts.length}</div><div class="stat-label">Outputs & Artifacts</div></div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fa-solid fa-list-check"></i></div><div><div class="stat-value">${totalSteps}</div><div class="stat-label">Total Process Steps</div></div></div>
    `;

    dom.processCardsGrid.innerHTML = ProcessData.processes.map(p => `
      <div class="process-card" data-process="${p.id}">
        <div class="process-card-header">
          <h3><i class="fa-solid ${p.icon}" style="color:${p.color}"></i> ${p.name}</h3>
          <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="process-card-desc">${p.description}</div>
        <div class="process-card-flow">${buildMiniFlowHTML(p.flow)}</div>
      </div>
    `).join('');

    $$('.process-card').forEach(card => {
      card.addEventListener('click', () => {
        state.activeProcessId = card.dataset.process;
        updateProcessSelector();
        navigateTo('bpmn');
        if (state.bpmnReady) loadProcess(card.dataset.process);
      });
    });

    // Also bind flow node clicks globally (for the old single-process dashboard)
  }

  function buildMiniFlowHTML(flow) {
    const iconMap = { 'start':'fa-play','end':'fa-flag-checkered','user-task':'fa-user','service-task':'fa-gear','gateway':'fa-diamond' };
    let h = '';
    for (let i = 0; i < flow.length; i++) {
      const s = flow[i];
      if (i > 0 && !s.branch) h += '<div class="flow-arrow"><i class="fa-solid fa-chevron-right"></i></div>';
      if (s.branch === 'failed') h += '<div class="flow-branch-label">No ↺</div>';
      if (s.branch === 'passed') h += '<div class="flow-branch-label">Yes</div>';
      if (s.branch === 'yes') h += '<div class="flow-branch-label">Yes</div>';
      if (s.branch === 'no') h += '<div class="flow-branch-label">No</div>';
      h += `<div class="flow-node"><div class="flow-node-icon ${s.type}"><i class="fa-solid ${iconMap[s.type]||'fa-circle'}"></i></div><span class="flow-node-label">${s.label}</span></div>`;
    }
    return h;
  }

  // ── Roles / Artifacts / Glossary ──────────────────────────
  function renderRoles(roles) {
    if (!dom.rolesGrid) return;
    if (!roles.length) { dom.rolesGrid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-users-slash"></i><p>No matching roles</p></div>'; return; }
    dom.rolesGrid.innerHTML = roles.map(r => `
      <div class="card" data-role="${r.id}"><div class="card-badge" style="color:${r.color}">${r.subtitle}</div><div class="card-title"><i class="fa-solid ${r.icon}" style="color:${r.color}"></i>${r.name}</div><div class="card-desc">${r.desc}</div></div>
    `).join('');
    $$('.card[data-role]', dom.rolesGrid).forEach(c => {
      c.addEventListener('click', () => {
        const r = ProcessData.roles.find(x => x.id === c.dataset.role);
        if (r) showRoleDetail(r);
      });
    });
  }

  function renderArtifacts(artifacts) {
    if (!dom.artifactsGrid) return;
    if (!artifacts.length) { dom.artifactsGrid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-box-open"></i><p>No matching artifacts</p></div>'; return; }
    dom.artifactsGrid.innerHTML = artifacts.map(a => `
      <div class="card" data-artifact="${a.id}"><div class="card-badge" style="color:${a.color}">${a.subtitle}</div><div class="card-title"><i class="fa-solid ${a.icon}" style="color:${a.color}"></i>${a.name}</div><div class="card-desc">${a.desc}</div></div>
    `).join('');
    $$('.card[data-artifact]', dom.artifactsGrid).forEach(c => {
      c.addEventListener('click', () => {
        const a = ProcessData.artifacts.find(x => x.id === c.dataset.artifact);
        if (a) showArtifactDetail(a);
      });
    });
  }

  function renderGlossary(items) {
    if (!dom.glossaryList) return;
    if (!items.length) { dom.glossaryList.innerHTML = '<div class="empty-state"><i class="fa-solid fa-book-open"></i><p>No matching terms</p></div>'; return; }
    dom.glossaryList.innerHTML = items.map(g => `
      <div class="glossary-item"><i class="fa-solid fa-bookmark"></i><div><h4>${g.term}</h4><p>${g.def}</p></div></div>
    `).join('');
  }

  // ── Modal ─────────────────────────────────────────────────
  function bindModal() {
    dom.modalClose.addEventListener('click', closeModal);
    dom.modalOverlay.addEventListener('click', e => { if (e.target === dom.modalOverlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }
  function openModal(title, html) { dom.modalTitle.textContent = title; dom.modalBody.innerHTML = html; dom.modalOverlay.classList.add('active'); }
  function closeModal() { dom.modalOverlay.classList.remove('active'); }

  function showRoleDetail(role) {
    openModal(role.name, `
      <div class="modal-section"><div class="modal-section-label">Role</div><p style="font-weight:600;font-size:1.05rem;color:${role.color};margin-bottom:4px;"><i class="fa-solid ${role.icon}"></i> ${role.subtitle}</p><p style="color:var(--text-secondary);font-size:0.9rem;">${role.desc}</p></div>
      <div class="modal-section"><div class="modal-section-label">Responsibilities</div><ul>${role.responsibilities.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      <div class="modal-section"><div class="modal-section-label">Permissions</div><ul>${role.permissions.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    `);
  }

  function showArtifactDetail(art) {
    openModal(art.name, `
      <div class="modal-section"><div class="modal-section-label">Artifact</div><p style="font-weight:600;font-size:1.05rem;color:${art.color};margin-bottom:4px;"><i class="fa-solid ${art.icon}"></i> ${art.subtitle}</p><p style="color:var(--text-secondary);font-size:0.9rem;">${art.desc}</p></div>
      <div class="modal-section"><div class="modal-section-label">Contents</div><ul>${art.contents.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      <div class="modal-section"><div class="modal-section-label">Lifecycle</div><p style="color:var(--text-secondary);font-size:0.9rem;">${art.lifecycle}</p></div>
      <div class="modal-section"><div class="modal-section-label">Validation</div><p style="color:var(--text-secondary);font-size:0.9rem;">${art.validation}</p></div>
    `);
  }

  function showElementDetail(elId, data) {
    const role = ProcessData.roles.find(r => r.id === data.role);
    const artifact = ProcessData.artifacts.find(a => a.id === data.artifact);
    const linkedHTML = (role || artifact) ? `<div class="modal-section"><div class="modal-section-label">Linked Resources</div><div class="modal-linked">
      ${role ? `<div class="modal-link-card" data-action="show-role" data-id="${role.id}"><i class="fa-solid ${role.icon}" style="color:${role.color};font-size:1.2rem;"></i><div><div style="font-size:0.7rem;color:var(--text-tertiary);">Role</div><div style="font-weight:600;font-size:0.9rem;">${role.name}</div></div></div>` : ''}
      ${artifact ? `<div class="modal-link-card" data-action="show-artifact" data-id="${artifact.id}"><i class="fa-solid ${artifact.icon}" style="color:${artifact.color};font-size:1.2rem;"></i><div><div style="font-size:0.7rem;color:var(--text-tertiary);">Artifact</div><div style="font-weight:600;font-size:0.9rem;">${artifact.name}</div></div></div>` : ''}
    </div></div>` : '';
    openModal(data.title, `<div class="modal-section"><div class="modal-section-label">Element Type</div><p style="font-weight:600;font-size:1rem;color:var(--accent);"><i class="fa-solid fa-diagram-project"></i> ${data.type}</p></div><div class="modal-section"><div class="modal-section-label">Description</div><p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;">${data.desc}</p></div>${linkedHTML}`);
    setTimeout(() => $$('.modal-link-card').forEach(c => {
      c.addEventListener('click', () => { closeModal(); setTimeout(() => {
        if (c.dataset.action === 'show-role') { const r = ProcessData.roles.find(x=>x.id===c.dataset.id); if(r) showRoleDetail(r); }
        else { const a = ProcessData.artifacts.find(x=>x.id===c.dataset.id); if(a) showArtifactDetail(a); }
      }, 200); });
    }), 50);
  }

  // ── Process Selector ──────────────────────────────────────
  function renderProcessSelector() {
    dom.processSelector.innerHTML = ProcessData.processes.map(p =>
      `<option value="${p.id}">${p.name}</option>`
    ).join('');
    dom.processSelector.value = state.activeProcessId;
  }

  function updateProcessSelector() {
    dom.processSelector.value = state.activeProcessId;
  }

  function bindProcessSelector() {
    dom.processSelector.addEventListener('change', () => {
      state.activeProcessId = dom.processSelector.value;
      if (state.bpmnReady) loadProcess(state.activeProcessId);
    });
  }

  // ── BPMN Viewer ───────────────────────────────────────────
  async function initBpmnViewer() {
    if (typeof BpmnJS === 'undefined') {
      dom.bpmnCanvas.innerHTML = '<div class="empty-state" style="height:100%;"><i class="fa-solid fa-cloud-bolt" style="color:var(--danger);"></i><h3 style="color:var(--danger);margin-bottom:8px;">BPMN Library Unavailable</h3><p>bpmn-js failed to load from CDN. Check your internet connection.</p></div>';
      return;
    }
    dom.bpmnCanvas.innerHTML = '<div class="loading-state" style="height:100%;"><i class="fa-solid fa-spinner"></i><p>Loading BPMN diagram…</p></div>';
    state.bpmnReady = true; // prevent re-init
    await loadProcess(state.activeProcessId);
  }

  async function loadProcess(processId) {
    const proc = ProcessData.getProcess(processId);
    if (!proc) return;

    dom.bpmnCanvas.innerHTML = '<div class="loading-state" style="height:100%;"><i class="fa-solid fa-spinner"></i><p>Loading BPMN diagram…</p></div>';

    // Destroy previous viewer
    if (state.bpmnViewer) {
      try { state.bpmnViewer.destroy(); } catch(e) {}
      state.bpmnViewer = null;
    }

    let bpmnXML;
    if (proc.bpmnXML && proc.bpmnXML.trim()) {
      bpmnXML = proc.bpmnXML;
    } else if (window.location.protocol === 'file:') {
      bpmnXML = proc.bpmnXML || '';
    } else {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3000);
        const r = await fetch(proc.bpmnFile, { signal: ctrl.signal });
        clearTimeout(t);
        if (r.ok) bpmnXML = await r.text();
        else throw new Error(`HTTP ${r.status}`);
      } catch {
        // Try loading the fallback from data.js
        bpmnXML = proc.bpmnXML;
      }
    }

    if (!bpmnXML) {
      dom.bpmnCanvas.innerHTML = '<div class="empty-state" style="height:100%;"><i class="fa-solid fa-circle-exclamation" style="color:var(--danger);"></i><h3 style="color:var(--danger);margin-bottom:8px;">No BPMN Data</h3><p>This process has no embedded XML and the .bpmn file could not be loaded.</p></div>';
      return;
    }

    try {
      dom.bpmnCanvas.innerHTML = '';
      state.bpmnViewer = new BpmnJS({ container: dom.bpmnCanvas, keyboard: { bindTo: window } });
      await state.bpmnViewer.importXML(bpmnXML);
      const canvas = state.bpmnViewer.get('canvas');
      const eventBus = state.bpmnViewer.get('eventBus');
      canvas.zoom('fit-viewport');

      eventBus.on('element.click', e => {
        const data = proc.elements[e.element.id];
        if (data) showElementDetail(e.element.id, data);
      });
      eventBus.on('element.hover', e => {
        if (proc.elements[e.element.id]) canvas.addMarker(e.element.id, 'highlight');
      });
      eventBus.on('element.out', e => {
        canvas.removeMarker(e.element.id, 'highlight');
      });
    } catch (err) {
      console.error('BPMN init error:', err);
      dom.bpmnCanvas.innerHTML = `<div class="empty-state" style="height:100%;"><i class="fa-solid fa-circle-exclamation" style="color:var(--danger);"></i><h3 style="color:var(--danger);margin-bottom:8px;">Failed to Load Diagram</h3><p>${err.message || 'Could not parse BPMN XML.'}</p></div>`;
    }

    // Wire reset zoom (re-attach since viewer was recreated)
    dom.btnResetZoom.onclick = () => {
      if (state.bpmnViewer) {
        try { state.bpmnViewer.get('canvas').zoom('fit-viewport'); } catch(e) {}
      }
    };
  }

  function fitBpmnViewport() {
    if (!state.bpmnViewer) return;
    try { state.bpmnViewer.get('canvas').resized(); state.bpmnViewer.get('canvas').zoom('fit-viewport'); } catch(e) {}
  }

  // ── Boot ──────────────────────────────────────────────────
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
