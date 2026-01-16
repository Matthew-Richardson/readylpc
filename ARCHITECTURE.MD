# ReadyLaPlata Architecture

**Technical architecture and design decisions**

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
├─────────────────────────────────────────────────────────────────┤
│  index.html    │    overview.html    │    evac.html             │
│                │                     │                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     shared.js                             │   │
│  │  • DOM utilities    • HTML escaping    • Timestamp fmt   │   │
│  │  • Chip creation    • Overlay toggles  • URL parsing     │   │
│  │  • CodeRED init     • Announcement init (JSON loader)    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                   shared-styles.css                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │ ArcGIS REST │     │ JSON Files  │     │  ArcGIS JS  │
   │   Feature   │     │             │     │    SDK      │
   │   Service   │     │ incident    │     │   (CDN)     │
   │             │     │ pastincident│     │             │
   │             │     │ announcement│     │             │
   └─────────────┘     └─────────────┘     └─────────────┘
```

---

## Module Architecture

### shared.js

Centralized JavaScript module containing all shared utilities. Loaded once and cached across pages.

```javascript
// Namespace export pattern
(function(global) {
  'use strict';
  
  // All utilities defined here...
  
  global.ReadyLaPlata = {
    $,                    // DOM selector
    escHTML,              // XSS prevention
    escapeQuery,          // SQL injection prevention
    formatTimestamp,      // Timestamp formatting
    updateTimestamp,      // DOM timestamp updater
    createChip,           // Incident chip factory
    sortIncidents,        // Incident sorting
    getIncidentParam,     // URL parameter parsing
    initCoderedOverlay,   // CodeRED modal init
    initAnnouncement,     // Announcement system init
    BRAND                 // Color constants
  };
})(window);
```

### Page-Specific Code

Each HTML file contains only page-specific logic:

| Page | Specific Responsibilities |
|------|---------------------------|
| `index.html` | Ready/Set/Go triangle visualization, home page layout |
| `overview.html` | County-wide map, incident pins, past incidents table |
| `evac.html` | Per-incident map, zone display, status card builder |

---

## Data Flow

### Incident Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  ArcGIS Feature │────▶│   Browser JS    │────▶│    DOM/UI      │
│     Service     │     │                 │     │                 │
│                 │     │  • Query zones  │     │  • Chips        │
│  • incident     │     │  • Filter/sort  │     │  • Map layers   │
│  • STATUS       │     │  • Escape HTML  │     │  • Zone boxes   │
│  • zonename     │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  incident.json  │────▶│   Browser JS    │────▶│  Status Card    │
│                 │     │                 │     │                 │
│  • name         │     │  • Fetch JSON   │     │  • Shelters     │
│  • shelters     │     │  • Match name   │     │  • Road info    │
│  • road         │     │  • Build HTML   │     │  • Directions   │
│  • etc.         │     │  • Escape vals  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Announcement Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ announcement.   │────▶│  initAnnounce-  │────▶│  Modal Overlay  │
│     json        │     │     ment()      │     │                 │
│                 │     │                 │     │  • Header       │
│  • enabled      │     │  • Fetch JSON   │     │  • Body text    │
│  • title        │     │  • Check flags  │     │  • Bullets      │
│  • paragraphs   │     │  • Build HTML   │     │  • Contact      │
│  • contact      │     │  • Bind events  │     │  • Buttons      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Security Architecture

### Input Validation

```
URL Parameter (?incident=...)
        │
        ▼
┌───────────────────┐
│  getIncidentParam │
│                   │
│  • Trim           │
│  • Max 80 chars   │
│  • Allowlist regex│
│  • Return or null │
└───────────────────┘
        │
        ▼
   Valid incident name or null
```

### Output Escaping

```
Untrusted Data (JSON, ArcGIS, URL)
        │
        ▼
┌───────────────────┐
│     escHTML()     │
│                   │
│  & → &amp;        │
│  < → &lt;         │
│  > → &gt;         │
│  " → &quot;       │
│  ' → &#39;        │
└───────────────────┘
        │
        ▼
   Safe for innerHTML
```

### Query Escaping

```
Incident Name
        │
        ▼
┌───────────────────┐
│   escapeQuery()   │
│                   │
│  ' → ''           │
└───────────────────┘
        │
        ▼
   Safe for ArcGIS WHERE clause
```

---

## Component Structure

### Incident Chip

```html
<button class="incident-chip" data-incident="Fire Name">
  <span class="incident-chip-icon">!</span>
  <span>Fire Name</span>
</button>
```

Built via `createChip()` using DOM methods (not innerHTML) for security.

### Evacuation Box

```html
<div class="evac-box evac-box-set" style="background:#fff36a">
  <div class="evac-title">SET - Pre-Evacuation</div>
  <div class="evac-body">
    <div>The following zones are under SET status...</div>
    <div class="evac-zones">
      <div class="zone-chip">Zone A</div>
      <div class="zone-chip">Zone B</div>
    </div>
    <div class="evac-note">Voluntary Evacuation...</div>
  </div>
</div>
```

### Announcement Modal

```html
<div id="announcementOverlay" class="announcement-overlay">
  <div class="announcement-dialog">
    <button class="announcement-close">×</button>
    <!-- Content injected by initAnnouncement() from JSON -->
    <div class="announcement-header">...</div>
    <div class="announcement-body">...</div>
    <div class="announcement-footer">...</div>
  </div>
</div>
```

---

## CSS Architecture

### Critical CSS (Inlined)

Each page includes minimal critical CSS in `<head>` for fast first paint:

```css
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0;height:100%;font-family:Arial,sans-serif;...}
.page-shell{min-height:100vh;display:flex;flex-direction:column}
.map-wrapper{max-width:900px;width:100%;margin:16px auto 0;padding:12px}
.map-card{width:100%;border-radius:14px;...}
```

### Async Loading

Non-critical CSS loaded without blocking:

```html
<link rel="stylesheet" href="shared-styles.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="shared-styles.css"></noscript>
```

### Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `max-width: 900px` | Tablet |
| `max-width: 700px` | Large phone |
| `max-width: 600px` | Phone |
| `max-width: 480px` | Small phone |

---

## State Management

### Session Storage

| Key | Purpose | Scope |
|-----|---------|-------|
| `announcementDismissed` | Prevents auto-open after dismiss | Session |

### URL State

| Parameter | Page | Purpose |
|-----------|------|---------|
| `incident` | evac.html | Filters to specific incident |

### DOM State

| Class | Element | Meaning |
|-------|---------|---------|
| `is-open` | Overlay | Modal is visible |
| `is-active` | Bell button | Announcement available |
| `is-viewed` | Bell button | User has seen announcement |
| `is-visible` | No incidents msg | Show empty state |
| `has-incidents` | Count badge | Style as active |
| `active` | Chip | Currently selected incident |

---

## Error Handling

### Network Errors

```javascript
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
} catch (err) {
  console.error('Error:', err);
  // Show user-friendly fallback
}
```

### Missing Data

| Scenario | Behavior |
|----------|----------|
| No incidents in ArcGIS | Show "No Active Incidents" message |
| Incident not in JSON | Show "No Status Information" card |
| announcement.json missing | Hide bell icon, log warning |
| pastincident.json empty | Show "No past incidents" message |

---

## Performance Optimizations

### JavaScript

- **Module pattern** — Single shared.js loaded once, cached
- **DOM caching** — Elements stored in DOM object at init
- **DocumentFragment** — Batch chip insertions
- **Event delegation** — Where applicable
- **Deferred loading** — ArcGIS SDK loaded with `defer`

### CSS

- **Critical CSS inlined** — No render blocking
- **Async loading** — media="print" trick
- **Minimal specificity** — Faster selector matching
- **will-change hints** — GPU acceleration for animations

### Network

- **DNS prefetch** — `<link rel="dns-prefetch">`
- **Preconnect** — `<link rel="preconnect">`
- **Static JSON** — No server processing
- **CDN resources** — ArcGIS SDK from Esri CDN

---

## Browser Compatibility

### Required Features

| Feature | Fallback |
|---------|----------|
| ES6+ (async/await, const, let) | None (required) |
| Fetch API | None (required) |
| CSS Grid/Flexbox | Graceful degradation |
| CSS Custom Properties | Hardcoded fallbacks |

### Polyfills

None required for supported browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

---

## Testing Checklist

### Manual Testing

- [ ] All pages load without console errors
- [ ] Incident chips appear and navigate correctly
- [ ] Maps load and zoom to incidents
- [ ] Modals open/close with button, overlay click, Escape key
- [ ] Announcement loads from JSON
- [ ] Past incidents table populates
- [ ] Mobile responsive at all breakpoints
- [ ] External links open in new tab

### Data Testing

- [ ] Empty incident.json (`[]`) shows no incidents message
- [ ] Invalid JSON shows error gracefully
- [ ] Missing JSON file hides related UI
- [ ] Special characters in incident names escaped properly
