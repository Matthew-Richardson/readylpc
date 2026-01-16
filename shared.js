/**
 * ReadyLaPlata Shared JavaScript Module
 * Consolidates common utilities, DOM helpers, and UI components
 */
(function(global) {
  'use strict';

  // ========== DOM HELPERS ==========
  const $ = id => document.getElementById(id);

  // ========== HTML ESCAPING ==========
  const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escHTML = s => String(s ?? '').replace(/[&<>"']/g, ch => ESC_MAP[ch]);

  // ========== QUERY ESCAPING ==========
  const escapeQuery = s => s.replace(/'/g, "''");

  // ========== TIMESTAMP FORMATTING ==========
  const TIMESTAMP_OPTIONS = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short'
  };

  const formatTimestamp = () => new Date().toLocaleString('en-US', TIMESTAMP_OPTIONS);

  const updateTimestamp = (el) => {
    if (el) el.textContent = 'Last loaded: ' + formatTimestamp();
  };

  // ========== INCIDENT CHIP CREATION ==========
  const createChip = (name, onClick) => {
    const chip = document.createElement('button');
    chip.className = 'incident-chip';
    chip.dataset.incident = name;

    const icon = document.createElement('span');
    icon.className = 'incident-chip-icon';
    icon.textContent = '!';

    const label = document.createElement('span');
    label.textContent = String(name ?? '');

    chip.append(icon, label);
    chip.addEventListener('click', onClick);
    return chip;
  };

  // ========== INCIDENT SORTING ==========
  const sortIncidents = (names, target) => {
    const targetLower = target?.toLowerCase();
    return names.sort((a, b) => {
      const al = a.toLowerCase(), bl = b.toLowerCase();
      if (targetLower) {
        if (al === targetLower) return -1;
        if (bl === targetLower) return 1;
      }
      return al.localeCompare(bl);
    });
  };

  // ========== URL PARAMETER PARSING ==========
  const getIncidentParam = () => {
    const params = new URLSearchParams(location.search);
    const raw = (params.get('incident') || params.get('Incident') || '').trim();
    const inc = raw.slice(0, 80);
    return inc && /^[a-z0-9 .,'\-()\/]+$/i.test(inc) ? inc : null;
  };

  // ========== OVERLAY FACTORY ==========
  const createOverlayToggle = (overlay) => {
    return (open) => {
      overlay.classList.toggle('is-open', open);
      overlay.setAttribute('aria-hidden', String(!open));
    };
  };

  // ========== CODERED OVERLAY INIT ==========
  const initCoderedOverlay = (elements) => {
    const { coderedButton, coderedOverlay, coderedClose, noIncidentCodered } = elements;
    if (!coderedButton || !coderedOverlay) return;

    const toggle = createOverlayToggle(coderedOverlay);

    coderedButton.addEventListener('click', () => toggle(true));
    coderedClose?.addEventListener('click', () => toggle(false));
    noIncidentCodered?.addEventListener('click', e => { e.preventDefault(); toggle(true); });
    coderedOverlay.addEventListener('click', e => { if (e.target === coderedOverlay) toggle(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && coderedOverlay.classList.contains('is-open')) toggle(false);
    });
  };

  // ========== ANNOUNCEMENT OVERLAY INIT ==========
  const buildAnnouncementHTML = (data) => {
    const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ESC_MAP[ch]);
    
    const bullets = data.bulletPoints?.length 
      ? `<ul class="announcement-list">${data.bulletPoints.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` 
      : '';

    const contact = data.contact ? `
      <div class="announcement-contact">
        <div class="announcement-contact-title">${esc(data.contact.title)}</div>
        ${data.contact.email ? `<div class="announcement-contact-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:${esc(data.contact.email)}">${esc(data.contact.email)}</a>
        </div>` : ''}
        ${data.contact.phone ? `<div class="announcement-contact-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <a href="tel:${esc(data.contact.phone.replace(/[^0-9]/g, ''))}">${esc(data.contact.phone)}</a>
        </div>` : ''}
      </div>` : '';

    // Note: paragraphs allow HTML (like <strong>) for formatting
    const paragraphs = (data.paragraphs || []).map(p => `<p>${p}</p>`).join('');

    return `
      <div class="announcement-header">
        <img src="https://cms9files.revize.com/laplata/_assets_/images/logo.png" alt="La Plata County Logo" class="announcement-logo">
        <div class="announcement-header-text">
          <h2 id="announcementTitle" class="announcement-title">${esc(data.title)}</h2>
          <p class="announcement-subtitle">${esc(data.subtitle)}</p>
        </div>
        ${data.badge ? `<div class="announcement-badge">${esc(data.badge)}</div>` : ''}
      </div>
      <div class="announcement-body">
        <div class="announcement-content">
          ${paragraphs}
          ${bullets}
          ${contact}
        </div>
      </div>
      <div class="announcement-footer">
        ${data.primaryButton ? `<a href="${esc(data.primaryButton.url)}" class="primary-pill" target="_blank" rel="noopener noreferrer">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          ${esc(data.primaryButton.text)}
        </a>` : ''}
        <button id="announcementDismiss" class="secondary-pill" type="button">${esc(data.dismissButton || 'Close')}</button>
      </div>`;
  };

  const initAnnouncement = async (elements, jsonUrl = 'announcement.json') => {
    const { announcementOverlay, announcementClose, announcementAlertBtn } = elements;
    if (!announcementOverlay) return;

    const toggle = (open) => {
      announcementOverlay.classList.toggle('is-open', open);
      announcementOverlay.setAttribute('aria-hidden', String(!open));
      if (!open && announcementAlertBtn) announcementAlertBtn.classList.add('is-viewed');
    };

    try {
      const res = await fetch(jsonUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // If disabled, hide the button and exit
      if (!data.enabled) {
        if (announcementAlertBtn) announcementAlertBtn.style.display = 'none';
        return;
      }

      // Show the alert button
      if (announcementAlertBtn) announcementAlertBtn.classList.add('is-active');

      // Build and inject the content
      const dialog = announcementOverlay.querySelector('.announcement-dialog');
      if (dialog) {
        const closeBtn = dialog.querySelector('.announcement-close');
        dialog.innerHTML = '';
        if (closeBtn) dialog.appendChild(closeBtn);
        dialog.insertAdjacentHTML('beforeend', buildAnnouncementHTML(data));
        
        // Bind dismiss button (just created)
        dialog.querySelector('#announcementDismiss')?.addEventListener('click', () => {
          toggle(false);
          sessionStorage.setItem('announcementDismissed', '1');
        });
      }

      // Bind events
      announcementAlertBtn?.addEventListener('click', () => toggle(true));
      announcementClose?.addEventListener('click', () => toggle(false));
      announcementOverlay.addEventListener('click', e => { if (e.target === announcementOverlay) toggle(false); });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && announcementOverlay.classList.contains('is-open')) toggle(false);
      });

      // Auto-open on first visit (session-based)
      if (data.autoOpen && !sessionStorage.getItem('announcementDismissed')) {
        toggle(true);
      }

    } catch (err) {
      console.warn('Announcement not loaded:', err.message);
      if (announcementAlertBtn) announcementAlertBtn.style.display = 'none';
    }
  };

  // ========== BRAND COLORS (shared constants) ==========
  const BRAND = Object.freeze({
    blue: '#0b4da2',
    blueLight: '#e6f0ff',
    gray: '#64748b',
    grayLight: '#fafafa',
    text: '#000',
    textHeading: '#0f172a',
    textMuted: '#6e6e6e',
    border: 'rgba(0,0,0,0.15)',
    borderLight: 'rgba(0,0,0,0.08)'
  });

  // ========== EXPORT ==========
  global.ReadyLaPlata = {
    $,
    escHTML,
    escapeQuery,
    formatTimestamp,
    updateTimestamp,
    createChip,
    sortIncidents,
    getIncidentParam,
    initCoderedOverlay,
    initAnnouncement,
    BRAND
  };

})(window);
