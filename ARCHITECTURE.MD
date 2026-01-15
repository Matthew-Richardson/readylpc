# ReadyLaPlata Architecture

**Technical System Design Documentation**

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  index.html   │    overview.html    │    evac.html                      │
│  (Home)       │    (Overview Map)   │    (Evacuation Details)           │
└───────┬───────┴──────────┬──────────┴───────────┬───────────────────────┘
        │                  │                      │
        ▼                  ▼                      ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────────────────────────┐
│ ArcGIS REST   │  │ ArcGIS REST   │  │         Static JSON Files         │
│ (Query API)   │  │ + WebMap      │  │  incident.json, pastincident.json │
└───────┬───────┘  └───────┬───────┘  └───────────────────────────────────┘
        │                  │                      
        ▼                  ▼                      
┌───────────────────────────────────┐  
│     ArcGIS Online                 │  
│  ┌─────────────────────────────┐  │  
│  │ Feature Service             │  │  
│  │ - Evacuation Zones          │  │  
│  │ - Incident field            │  │  
│  │ - STATUS field (Set/Go)     │  │  
│  │ - zonename field            │  │  
│  └─────────────────────────────┘  │  
│  ┌─────────────────────────────┐  │  
│  │ WebMap                      │  │  
│  │ - Configured symbology      │  │  
│  │ - Additional layers         │  │  
│  └─────────────────────────────┘  │  
└───────────────────────────────────┘  
```

---

## Component Architecture

### Frontend (Static HTML/CSS/JS)

```
┌─────────────────────────────────────────────────────────────────┐
│                         HTML Pages                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  index.html  │  │overview.html │  │  evac.html   │          │
│  │              │  │              │  │              │          │
│  │ • RSG Info   │  │ • All pins   │  │ • Zone map   │          │
│  │ • Incidents  │  │ • Past table │  │ • SET/GO     │          │
│  │ • Timeline   │  │ • Navigation │  │ • Resources  │          │
│  │ • Announce   │  │ • Announce   │  │ • Announce   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           ▼                                      │
│              ┌────────────────────────┐                         │
│              │   shared-styles.css    │                         │
│              │                        │                         │
│              │ • Layout & typography  │                         │
│              │ • Component styles     │                         │
│              │ • Responsive design    │                         │
│              │ • Announcement styles  │                         │
│              │ • Animation keyframes  │                         │
│              └────────────────────────┘                         │
│                                                                  │
│              ┌────────────────────────┐                         │
│              │     JSON Data Files    │                         │
│              │                        │                         │
│              │ • incident.json        │                         │
│              │ • pastincident.json    │                         │
│              └────────────────────────┘                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### JavaScript Module Structure

Each HTML page contains an IIFE (Immediately Invoked Function Expression) with consistent structure:

```javascript
(function() {
  'use strict';

  // ========== CONFIGURATION ==========
  const CONFIG = { /* URLs, field names, constants */ };

  // ========== ANNOUNCEMENT TOGGLE ==========
  const SHOW_ANNOUNCEMENT = true;
  const AUTO_OPEN_ANNOUNCEMENT = true; // Only on index.html

  // ========== DOM CACHE ==========
  const DOM = {};
  const $ = id => document.getElementById(id);

  // ========== UTILITIES ==========
  const formatTimestamp = () => { /* Returns date with timezone */ };
  // Other shared helper functions

  // ========== DATA FETCHING ==========
  // Async functions for API/JSON calls

  // ========== MAP INITIALIZATION ==========
  // ArcGIS SDK setup (where applicable)

  // ========== OVERLAY HANDLERS ==========
  function initCoderedOverlay() { /* ... */ }
  function initAnnouncement() { /* ... */ }

  // ========== INIT ==========
  function init() {
    // Cache DOM, setup handlers, load data
  }

  // DOMContentLoaded or immediate execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

---

## Data Flow

### Incident Data Flow

```
┌─────────────┐    Query     ┌─────────────┐    REST API    ┌─────────────┐
│   Browser   │ ──────────▶  │   ArcGIS    │ ◀────────────▶ │  Feature    │
│  (evac.html)│              │   SDK       │                │  Service    │
└──────┬──────┘              └─────────────┘                └─────────────┘
       │
       │  Fetch JSON
       ▼
┌─────────────┐   HTTP GET   ┌─────────────┐
│   Browser   │ ──────────▶  │incident.json│
│  (evac.html)│              │ (static)    │
└──────┬──────┘              └─────────────┘
       │
       │ Parse & Render
       ▼
┌─────────────┐
│  Status     │
│  Card HTML  │
└─────────────┘
```

### Past Incidents Flow

```
┌─────────────┐   HTTP GET   ┌─────────────────┐
│   Browser   │ ──────────▶  │pastincident.json│
│(overview.html)             │    (static)     │
└──────┬──────┘              └─────────────────┘
       │
       │ Parse, Sort, Render
       ▼
┌─────────────┐
│  HTML Table │
│  (sorted by │
│  date desc) │
└─────────────┘
```

### Announcement System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Page Load                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Check: SHOW_ANNOUNCEMENT === true?                             │
│         │                                                        │
│         ├─── No ──▶ Bell icon hidden, done                      │
│         │                                                        │
│         ▼ Yes                                                    │
│  Show bell icon (.is-active class)                              │
│         │                                                        │
│  Check: AUTO_OPEN_ANNOUNCEMENT === true                         │
│         AND page is index.html?                                 │
│         │                                                        │
│         ├─── No ──▶ Wait for user click                         │
│         │                                                        │
│         ▼ Yes                                                    │
│  Auto-open announcement modal                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ArcGIS Integration

### SDK Loading Strategy

```html
<!-- Deferred loading - non-blocking -->
<script src="https://js.arcgis.com/4.31/" defer></script>
```

```javascript
// Polling pattern for AMD loader availability
function initMap() {
  if (typeof require === 'undefined') {
    setTimeout(initMap, 100);  // Retry until loaded
    return;
  }
  
  require(['esri/Map', 'esri/views/MapView', ...], (Map, MapView, ...) => {
    // Initialize map
  });
}
```

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        MapView                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  WebMap (evac.html only)                               │ │
│  │  - Pre-configured symbology                            │ │
│  │  - Road closures, info points, warnings                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  GraphicsLayer (overview.html)                         │ │
│  │  - Dynamic incident pins                               │ │
│  │  - Text labels                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  FeatureLayer (hidden, for queries)                    │ │
│  │  - Evacuation zones                                    │ │
│  │  - Incident names                                      │ │
│  │  - Zone extents                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Basemap                                               │ │
│  │  - topo-vector (overview.html)                         │ │
│  │  - From WebMap (evac.html)                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### REST API Calls

The application queries ArcGIS Feature Services directly via REST:

```
https://services2.arcgis.com/{org}/ArcGIS/rest/services/LPC_Evac_Zones_View/FeatureServer/0
```

#### Get Distinct Incident Names

```
GET /query
  ?where=1=1
  &outFields=incident
  &returnDistinctValues=true
  &returnGeometry=false
  &orderByFields=incident
  &f=json
```

#### Get Zones for Specific Incident

```
GET /query
  ?where=incident='East Canyon' AND STATUS IN ('Set','Go')
  &outFields=*
  &returnGeometry=false
  &f=json
```

#### Get Incident Extent (for map zoom)

```
GET /query
  ?where=incident='East Canyon'
  &returnExtentOnly=true
  &f=json
```

---

## Timestamp Display

All pages display timestamps with timezone identifiers:

```javascript
const formatTimestamp = () => {
  const now = new Date();
  const options = { 
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short'
  };
  return now.toLocaleString('en-US', options);
};

// Output: "1/15/2026, 3:45:22 PM MST"
```

---

## Caching Strategy

### Browser Caching

| Resource | Strategy | Duration |
|----------|----------|----------|
| ArcGIS SDK | HTTP Cache | Long (versioned URL) |
| shared-styles.css | HTTP Cache | Based on server config |
| Map tiles | ArcGIS CDN | Automatic |
| JSON files | HTTP Cache | Based on server config |

### No Server-Side Caching

With static JSON files, caching is handled entirely by the browser and HTTP headers. This simplifies the architecture and reduces dependencies.

---

## Responsive Design

### Breakpoints

| Breakpoint | Target | Changes |
|------------|--------|---------|
| `> 700px` | Desktop | Full labels, scroll zoom enabled |
| `520-700px` | Tablet | Shortened nav labels |
| `420-520px` | Mobile | Compact spacing, smaller fonts |
| `< 420px` | Small mobile | Icon-only navigation |
| `< 360px` | Very small | Minimal UI |

### Mobile Optimizations

```javascript
// Disable scroll zoom on mobile (prevents accidental zooms)
if (window.innerWidth < 700 && view.navigation) {
  view.navigation.mouseWheelZoomEnabled = false;
  view.navigation.browserTouchPanEnabled = false;
}
```

---

## Performance Optimizations

### Critical Rendering Path

```html
<head>
  <!-- 1. Critical CSS inlined for immediate render -->
  <style>
    *,*::before,*::after{box-sizing:border-box}
    html,body{margin:0;padding:0;...}
    /* Minimal layout styles */
  </style>

  <!-- 2. Non-critical CSS loaded async -->
  <link rel="stylesheet" href="shared-styles.css" 
        media="print" onload="this.media='all'">
  
  <!-- 3. DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="//js.arcgis.com">
  <link rel="preconnect" href="https://js.arcgis.com" crossorigin>
</head>

<body>
  <!-- Content -->
  
  <!-- 4. Scripts deferred to end -->
  <script src="https://js.arcgis.com/4.31/" defer></script>
</body>
```

### DOM Performance

```javascript
// Cache DOM references at init (avoid repeated lookups)
const DOM = {};
function init() {
  DOM.countBadge = document.getElementById('incidentCountBadge');
  DOM.chipsEl = document.getElementById('incidentChips');
  DOM.announcementOverlay = document.getElementById('announcementOverlay');
  // ...
}

// Batch DOM insertions with DocumentFragment
const frag = document.createDocumentFragment();
for (const name of names) {
  frag.appendChild(createChip(name, onClick));
}
DOM.chipsEl.appendChild(frag);  // Single reflow
```

---

## Security Model

### Content Security

```javascript
// HTML escaping for all dynamic content
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ESC_MAP[c]);
}
```

### External Links

```html
<!-- All external links use security attributes -->
<a href="..." target="_blank" rel="noopener noreferrer">
```

### SQL Injection Prevention (ArcGIS Queries)

```javascript
// Escape single quotes in query strings
const escapeQuery = s => s.replace(/'/g, "''");
const where = `incident='${escapeQuery(name)}'`;
```

---

## Error Handling

### Frontend Errors

```javascript
// Graceful degradation with user feedback
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  // Process data
} catch (err) {
  console.error('Error loading data:', err);
  DOM.element.innerHTML = '<div>Error loading data.</div>';
}
```

### JSON Loading Errors

```javascript
// Past incidents table fallback
try {
  const res = await fetch(CONFIG.pastIncidentsJsonUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const incidents = await res.json();
  // Render table
} catch (err) {
  console.error('Error loading past incidents:', err);
  DOM.pastIncidentsTable.innerHTML = 
    '<div class="past-incidents-error">Unable to load past incidents.</div>';
}
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Production Environment                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐                                            │
│  │  Web Server     │  Static files                              │
│  │  (GitHub Pages, │  ───────────────────────────▶ Users        │
│  │   Netlify, etc.)│  • HTML, CSS, JS                           │
│  │                 │  • incident.json                           │
│  │                 │  • pastincident.json                       │
│  └─────────────────┘                                            │
│                                                                  │
│  ┌─────────────────┐                                            │
│  │  ArcGIS Online  │  Map tiles, feature queries                │
│  │  (arcgis.com)   │  ───────────────────────────▶ Users        │
│  └─────────────────┘                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Monitoring & Logging

### Client-Side

- `console.error()` for caught exceptions
- Browser DevTools Network tab for request debugging

### ArcGIS

- ArcGIS Online dashboard for service usage
- Feature Service request logs

---

## Future Considerations

### Potential Improvements

1. **Service Worker** — Offline support for critical information
2. **Push Notifications** — Real-time zone status updates
3. **PWA Manifest** — Install as mobile app
4. **CDN Distribution** — Faster global delivery of static files

### Scalability

Current architecture handles typical emergency traffic:

- ArcGIS Online auto-scales
- Static files can be CDN-distributed
- JSON files are tiny and cacheable
