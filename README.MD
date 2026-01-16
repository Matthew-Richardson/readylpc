# ReadyLaPlata

**La Plata County Emergency Evacuation Information System**

A web application providing real-time evacuation zone information, incident tracking, and emergency resources for La Plata County, Colorado.

![Status](https://img.shields.io/badge/status-production-green)
![Platform](https://img.shields.io/badge/platform-web-blue)
![ArcGIS](https://img.shields.io/badge/ArcGIS-4.31-orange)

---

## Overview

ReadyLaPlata is the official evacuation information viewer for La Plata County Office of Emergency Management (LPCOEM). It displays real-time evacuation zones using the **Ready, Set, Go!** system and integrates with ArcGIS mapping services and CodeRED emergency alerts.

### Key Features

- **Interactive evacuation maps** powered by ArcGIS WebMaps
- **Real-time zone status** (SET/GO evacuation levels)
- **Incident support resources** (shelters, check-in locations, road closures, animal evacuation)
- **Past incidents archive** loaded from static JSON file
- **CodeRED integration** for emergency alert signup
- **JSON-driven announcement system** with bell icon and modal overlay
- **Mobile-responsive design** optimized for emergency use
- **Offline-friendly** critical CSS inlined for fast first paint

---

## Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Ready, Set, Go! education and incident list |
| **Overview Map** | `overview.html` | County-wide map with all active incident pins and past incidents table |
| **Evacuation Details** | `evac.html` | Per-incident evacuation zones and support resources |

---

## Quick Start

### Prerequisites

- Web server (Apache, Nginx, IIS, or static hosting like GitHub Pages)
- ArcGIS Online account with configured WebMap and Feature Services

### Deployment

1. **Upload files** to your web server:
   ```
   index.html
   overview.html
   evac.html
   shared.js
   shared-styles.css
   favicon.svg
   incident.json
   pastincident.json
   announcement.json
   ```

2. **Configure JSON data files** (see Configuration section below)

3. **Update ArcGIS URLs** in each HTML file if needed:
   ```javascript
   const CONFIG = {
     incidentLayerUrl: 'YOUR_ARCGIS_FEATURE_SERVICE_URL',
     // ...
   };
   ```

---

## Configuration

### JSON Data Files

All content configuration is done through JSON files—no code changes required.

| File | Purpose | Auto-opens |
|------|---------|------------|
| `incident.json` | Active incident support resources | — |
| `pastincident.json` | Historical incident records | — |
| `announcement.json` | Site-wide announcement banner | Configurable |

See `JSON-EDITING-GUIDE.md` for detailed editing instructions and copy-paste templates.

#### Quick Reference

**Disable announcement:**
```json
{ "enabled": false }
```

**Clear all active incidents:**
```json
[]
```

### ArcGIS Services

| Service | URL | Purpose |
|---------|-----|---------|
| Feature Layer | `services2.arcgis.com/.../LPC_Evac_Zones_View/FeatureServer/0` | Evacuation zone polygons |
| WebMap | Portal Item ID `58a8bb313db64271a55e7960cb839f64` | Pre-configured map with symbology |

---

## URL Parameters

### evac.html

| Parameter | Example | Description |
|-----------|---------|-------------|
| `incident` | `?incident=East%20Canyon` | Filters map and data to specific incident |

---

## File Structure

```
readylaplata/
├── index.html           # Home page with Ready, Set, Go! info
├── overview.html        # County-wide incident overview map
├── evac.html            # Per-incident evacuation details
├── shared.js            # Shared JavaScript utilities module
├── shared-styles.css    # Shared stylesheet
├── favicon.svg          # Site favicon
├── incident.json        # Active incident support resources
├── pastincident.json    # Historical incident records
├── announcement.json    # Announcement content and settings
└── docs/
    ├── README.md            # This file
    ├── API.md               # Data format reference
    ├── ARCHITECTURE.md      # Technical architecture
    ├── SETUP.md             # Deployment guide
    ├── SECURITY.md          # Security documentation
    └── JSON-EDITING-GUIDE.md # JSON editing reference
```

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile Safari | iOS 14+ | ✅ Full support |
| Chrome Mobile | Android 10+ | ✅ Full support |

---

## Performance

### Optimization Techniques

- **Shared JS module** — Common utilities loaded once, cached across pages
- **Critical CSS inlined** — First paint without external CSS blocking
- **Async stylesheet loading** — Non-critical CSS loaded via `media="print"` trick
- **DNS prefetch/preconnect** — Reduced latency for ArcGIS resources
- **DOM caching** — Elements cached at init to avoid repeated lookups
- **DocumentFragment** — Batch DOM insertions for incident chips
- **Static JSON files** — Fast loading without server-side processing

### Bundle Sizes

| Resource | Size | Notes |
|----------|------|-------|
| shared.js | ~6 KB | Shared utilities module |
| shared-styles.css | ~38 KB | Loaded async |
| Inline critical CSS | ~1 KB | Embedded in `<head>` |
| ArcGIS SDK | ~2.5 MB | Loaded with `defer` |

---

## Accessibility

- Semantic HTML5 structure
- ARIA labels on interactive elements
- Keyboard navigation support (Escape closes modals)
- Color contrast meets WCAG 2.1 AA standards
- Screen reader-friendly incident announcements

---

## Privacy & Security

This application is **public-facing** and **read-only**.

### Privacy

- **No user accounts or login** — All information is publicly accessible
- **No personal information collected** — No forms, no user input stored
- **Public data only** — Evacuation zones and incident resources are public record

### Security

- **Read-only** — The application only displays data; it cannot modify ArcGIS or JSON files
- All external links use `rel="noopener noreferrer"`
- HTML escaping for all dynamic content (centralized in `shared.js`)
- SQL injection prevention in ArcGIS queries
- URL parameter validation with allowlist
- HTTPS enforced for all external resources

See `SECURITY.md` for detailed security documentation.

---

## Contributing

This project is maintained by La Plata County GIS on behalf of La Plata County Office of Emergency Management. For questions or issues, contact the LPCOEM GIS team.

---

## License

© La Plata County, Colorado. All rights reserved.

---

## Related Links

- [La Plata County OEM](https://www.lpcgov.org/departments/emergency_management/index.php)
- [CodeRED Signup](https://public.coderedweb.com/CNE/en-US/)
- [La Plata County GIS/IT](https://www.lpcgov.org/departments/gis___mapping/index.php)
