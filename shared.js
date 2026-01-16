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
  const initAnnouncement = (elements, showAnnouncement, autoOpen = false) => {
    const { announcementOverlay, announcementClose, announcementDismiss, announcementAlertBtn } = elements;
    if (!showAnnouncement || !announcementOverlay) return;

    if (announcementAlertBtn) announcementAlertBtn.classList.add('is-active');

    const toggle = (open) => {
      announcementOverlay.classList.toggle('is-open', open);
      announcementOverlay.setAttribute('aria-hidden', String(!open));
      if (!open && announcementAlertBtn) announcementAlertBtn.classList.add('is-viewed');
    };

    if (autoOpen) toggle(true);

    announcementClose?.addEventListener('click', () => toggle(false));
    announcementDismiss?.addEventListener('click', () => toggle(false));
    announcementOverlay.addEventListener('click', e => { if (e.target === announcementOverlay) toggle(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && announcementOverlay.classList.contains('is-open')) toggle(false);
    });
    announcementAlertBtn?.addEventListener('click', () => toggle(true));
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
