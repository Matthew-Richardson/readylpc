# Security Measures and Risk Review

## Scope

Static client-side HTML/JavaScript application:

- `index.html`
- `overview.html`
- `evac.html`
- `shared.js` (centralized security utilities)

These pages load ArcGIS JS 4.31 and consume data from:
- ArcGIS Feature Services
- Static JSON files (`incident.json`, `pastincident.json`, `announcement.json`)

This document describes implemented security controls, remaining risks, and recommended practices.

---

## Executive Summary

**Primary risk:**  
DOM-based Cross-Site Scripting (XSS) caused by untrusted strings (URL parameters, JSON fields, Feature Service attributes) being inserted into the page as HTML.

**Mitigations implemented:**
- All security utilities centralized in `shared.js`
- Untrusted values escaped via `escHTML()` before HTML insertion
- URL parameter validated with length limit and character allowlist
- ArcGIS query values escaped via `escapeQuery()`
- External links protected with `rel="noopener noreferrer"`

**Remaining concerns:**  
Defense-in-depth items including Content Security Policy headers when deployed on production servers.

---

## How the App Is Exposed to the Internet

- Users load the site via standard URL, optionally including `?incident=...`
- JavaScript executes entirely in the browser
- Web server only serves static files; no server-side execution
- Data is fetched from:
  1. ArcGIS Feature Services (incidents / evacuation zones)
  2. Local JSON files (incident status, past incidents, announcement content)

**Any value originating from the URL, JSON, or Feature Services is treated as untrusted input.**

---

## Security Utilities in shared.js

All security-critical functions are centralized in `shared.js` for consistency and maintainability.

### HTML Escaping (XSS Prevention)

```javascript
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escHTML = s => String(s ?? '').replace(/[&<>"']/g, ch => ESC_MAP[ch]);
```

**Used for:**
- Incident names from ArcGIS
- Zone names from ArcGIS
- All fields from `incident.json`
- Display text from `pastincident.json`
- User-facing content from `announcement.json`
- Error messages

### Query Escaping (SQL Injection Prevention)

```javascript
const escapeQuery = s => s.replace(/'/g, "''");
```

**Used for:**
- ArcGIS REST API WHERE clauses
- Incident name parameters in queries

### URL Parameter Validation

```javascript
const getIncidentParam = () => {
  const params = new URLSearchParams(location.search);
  const raw = (params.get('incident') || params.get('Incident') || '').trim();
  const inc = raw.slice(0, 80);  // Length limit
  return inc && /^[a-z0-9 .,'\-()\/]+$/i.test(inc) ? inc : null;  // Allowlist
};
```

**Protections:**
- Trimmed and capped at 80 characters
- Validated against allowlist regex
- Invalid values return `null` (app behaves as if no incident specified)

---

## Security Measures by Category

### 1. DOM XSS Prevention

| Data Source | Escaping Method | Location |
|-------------|-----------------|----------|
| Incident names (ArcGIS) | `escHTML()` | Chip labels, titles |
| Zone names (ArcGIS) | `escHTML()` | Zone chip content |
| incident.json fields | `escHTML()` | Status card content |
| pastincident.json | `escHTML()` | Table cells |
| announcement.json | `escHTML()` | Modal content* |
| Error messages | `escHTML()` | Error displays |

*Note: `announcement.json` paragraphs intentionally allow `<strong>` tags for formatting. All other fields are escaped.

### 2. Incident Chips (Safe DOM Construction)

Chips are built using DOM methods instead of innerHTML:

```javascript
const createChip = (name, onClick) => {
  const chip = document.createElement('button');
  chip.className = 'incident-chip';
  chip.dataset.incident = name;

  const label = document.createElement('span');
  label.textContent = String(name ?? '');  // Safe: textContent, not innerHTML

  chip.append(icon, label);
  return chip;
};
```

### 3. ArcGIS Query Protection

Single quotes in incident names are doubled before inclusion in WHERE clauses:

```javascript
const where = `incident='${escapeQuery(INCIDENT)}' AND STATUS IN ('Set','Go')`;
```

### 4. External Link Protection

All external links use security attributes:

```html
<a href="..." target="_blank" rel="noopener noreferrer">
```

This prevents:
- Tabnabbing attacks
- Access to `window.opener`

### 5. URL Encoding

User-provided values in generated URLs are encoded:

```javascript
location.href = `evac.html?incident=${encodeURIComponent(name)}`;
```

```javascript
`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
```

---

## Data Flow Security Analysis

### URL Parameter Flow

```
User Input: ?incident=<value>
      │
      ▼
┌─────────────────────────┐
│   getIncidentParam()    │
│                         │
│   • Trim whitespace     │
│   • Limit to 80 chars   │
│   • Allowlist validation│
│   • Return value or null│
└─────────────────────────┘
      │
      ▼
Valid incident name ──────┬──────────────────────────────┐
      │                   │                              │
      ▼                   ▼                              ▼
┌───────────┐      ┌─────────────┐              ┌──────────────┐
│ escHTML() │      │ escapeQuery │              │ encodeURI-   │
│           │      │     ()      │              │ Component()  │
└───────────┘      └─────────────┘              └──────────────┘
      │                   │                              │
      ▼                   ▼                              ▼
   Display            ArcGIS               URL generation
   in HTML            queries              (navigation)
```

### JSON Data Flow

```
incident.json / announcement.json
      │
      ▼
┌─────────────────────────┐
│     fetch() + JSON      │
│       .parse()          │
└─────────────────────────┘
      │
      ▼
┌─────────────────────────┐
│      escHTML()          │
│  (all display values)   │
└─────────────────────────┘
      │
      ▼
   Safe HTML insertion
```

---

## Trust Boundaries

| Data Source | Trust Level | Handling |
|-------------|-------------|----------|
| URL parameters | Untrusted | Validate + escape |
| ArcGIS Feature Service | Semi-trusted* | Escape for display |
| incident.json | Semi-trusted* | Escape for display |
| pastincident.json | Semi-trusted* | Escape for display |
| announcement.json | Semi-trusted* | Escape (except paragraphs) |
| Static HTML/JS/CSS | Trusted | N/A |

*Semi-trusted: Controlled by organization but could contain unexpected characters.

---

## Announcement System Security

The announcement system loads content from `announcement.json` at runtime.

### Escaped Fields
- `title` - Fully escaped
- `subtitle` - Fully escaped
- `badge` - Fully escaped
- `bulletPoints` - Fully escaped
- `contact.title` - Fully escaped
- `contact.email` - Fully escaped
- `contact.phone` - Fully escaped
- `primaryButton.text` - Fully escaped
- `primaryButton.url` - Fully escaped
- `dismissButton` - Fully escaped

### Intentionally Unescaped
- `paragraphs` - Allows `<strong>` for bold text

**Rationale:** Paragraphs are controlled by administrators who need basic formatting. Only `<strong>` is documented as supported. Other HTML would render but is not intended.

**Risk:** Low. JSON file is server-controlled and not user-editable.

---

## Session Storage

| Key | Purpose | Security Impact |
|-----|---------|-----------------|
| `announcementDismissed` | Prevents auto-open after dismiss | None (boolean flag only) |

No sensitive data is stored in session or local storage.

---

## Recommended Server Configuration

### HTTP Security Headers

When deploying to IIS or other web servers, add these headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.arcgis.com; style-src 'self' 'unsafe-inline' https://js.arcgis.com; img-src 'self' data: https:; connect-src 'self' https://*.arcgis.com;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS

- Enforce HTTPS for all traffic
- Use HSTS header for production

---

## Attack Surface Summary

| Vector | Risk | Mitigation |
|--------|------|------------|
| XSS via URL parameter | Medium | Allowlist validation + escaping |
| XSS via JSON content | Low | HTML escaping |
| XSS via ArcGIS data | Low | HTML escaping |
| SQL injection (ArcGIS) | Low | Query escaping |
| Tabnabbing | Low | rel="noopener noreferrer" |
| Clickjacking | Low | X-Frame-Options header |

---

## Security Checklist

### Code Review
- [ ] All dynamic content uses `escHTML()` or `textContent`
- [ ] URL parameters validated via `getIncidentParam()`
- [ ] ArcGIS queries use `escapeQuery()`
- [ ] External links have `rel="noopener noreferrer"`
- [ ] URLs use `encodeURIComponent()`

### Deployment
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] JSON files not publicly writable
- [ ] ArcGIS services properly permissioned

### Maintenance
- [ ] Update ArcGIS SDK periodically
- [ ] Review JSON file access permissions
- [ ] Monitor for new XSS vectors in dependencies

---

## Incident Response

If a security issue is discovered:

1. **Assess scope** - Determine if user data is at risk (note: this app collects no user data)
2. **Patch** - Update affected files
3. **Deploy** - Push updated files to server
4. **Verify** - Test that fix is effective
5. **Document** - Update this security document

---

## Contact

For security concerns, contact La Plata County IT Security team.
