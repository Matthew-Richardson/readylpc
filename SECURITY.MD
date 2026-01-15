# Security Measures and Risk Review

## Scope

Static client-side HTML/JavaScript pages:

- `index-5.html`
- `overview-5.html`
- `evac-10.html`

These pages load ArcGIS JS 4.31 and consume data from:
- ArcGIS Feature Services
- Static JSON files

This document describes implemented security controls, remaining risks, and recommended next steps.

---

## Executive Summary

**Primary risk:**  
DOM-based Cross-Site Scripting (XSS) caused by untrusted strings (URL parameters, JSON fields, Feature Service attributes) being inserted into the page as HTML.

**Mitigations implemented:**
- Untrusted values are rendered using `textContent` or escaped before inclusion in any HTML templates.
- The `incident` URL parameter is validated (length + allowlist).

**Remaining concerns:**  
Mostly defense-in-depth items, including stricter link sanitization and security headers when deployed on IIS.

---

## How the App Is Exposed to the Internet

- Users load the site via a standard URL, optionally including `?incident=...`.
- JavaScript executes entirely in the browser.
- GitHub Pages or IIS only serve static files; no server-side execution occurs.
- Data is fetched from:
  1. ArcGIS Feature Services (incidents / evacuation zones)
  2. Local JSON files (incident status content, past incidents)

**Any value originating from the URL, JSON, or Feature Services is treated as untrusted input.**

---

## Security Measures Implemented in the Code

### 1. Safe Rendering of Untrusted Strings (XSS Mitigation)

- **Incident chips**  
  Built using DOM nodes and `textContent` instead of `innerHTML`.

- **HTML templates that must remain**  
  (evacuation boxes, empty states, error blocks)  
  All dynamic values are escaped using `escHTML(...)` before insertion.

- **Past incidents table**  
  Incident names and date values are escaped before being written into table HTML.

- **Error output**  
  Error messages are escaped prior to rendering.

**Result:**  
Untrusted strings cannot be interpreted as executable markup.

---

### 2. URL Parameter Validation (`incident`)

- Trimmed and capped at **80 characters**
- Validated against an allowlist regex (letters, numbers, spaces, limited punctuation)
- Invalid values cause the app to behave as if no incident was provided

**Result:**  
Prevents malformed input and reduces risk of downstream query abuse.

---

### 3. Feature Service Query Escaping

- Single quotes in the `incident` value are doubled before being placed into the ArcGIS REST `WHERE` clause.

**Note:**  
This is a secondary safety measure and does not replace allowlist validation (which is already implemented).

---

### 4. Safer Outbound Links (Tabnabbing Protection)

- External links opened in a new tab use:
  ```html
  rel="noopener noreferrer"
