# ReadyLaPlata API Reference

**Google Apps Script Backend API**

The ReadyLaPlata backend is a Google Apps Script web app that serves incident data from Google Sheets as formatted HTML.

---

## Base URL

```
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

---

## Endpoints

### Get Incident Support Resources

Returns formatted HTML card with incident support information (shelters, check-in locations, road closures, animal evacuation sites).

```
GET ?incident={name}
```

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `incident` | string | Yes | Incident name (case-insensitive) |

#### Response

**Content-Type:** `text/html`

Returns a styled HTML card containing:
- Header with incident title and status link button
- Check-in location with Google Maps directions
- Evacuation shelters with directions
- Road closures list
- Animal evacuation (small and large animals)

#### Example Request

```
GET ?incident=East%20Canyon
```

#### Example Response

```html
<style>
  .status-btn:hover,.dir-btn:hover{background:#0b4da2!important;...}
</style>
<div style="font-family:Arial,sans-serif">
  <div style="background:#ffffff;border-radius:14px;...">
    <!-- Header block -->
    <div style="padding:14px 18px;...">
      <div style="display:flex;...">
        <div>Incident Support Resources</div>
        <a href="..." class="status-btn">View Status Update</a>
      </div>
    </div>
    <!-- Content sections -->
    <div style="padding:16px 18px 18px 18px">
      <!-- Check-in, Shelters, Road Closures, Animal Evacuation -->
    </div>
  </div>
</div>
```

#### Error Response

If incident not found or error occurs:

```html
<div style="font-family:Arial,sans-serif">
  <div style="background:#fffbeb;border:1px solid #f59e0b;...">
    <div>Notice</div>
    <div>No data found for incident: Example</div>
  </div>
</div>
```

#### Empty Response

If no incident parameter provided:

```html
<div></div>
```

---

### Get Past Incidents

Returns an HTML table of historical incidents.

```
GET ?type=past
```

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | Yes | Must be `past` |

#### Response

**Content-Type:** `text/html`

Returns a styled HTML table with columns:
- Incident Name
- Start Date
- Evacuations Lifted

Sorted by most recent first (by lifted date, then start date).

#### Example Request

```
GET ?type=past
```

#### Example Response

```html
<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
  <thead>
    <tr style="background:#fafafa">
      <th style="...">Incident Name</th>
      <th style="...">Start Date</th>
      <th style="...">Evacuations Lifted</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="...">East Canyon Fire</td>
      <td style="...">Jun 15, 2024</td>
      <td style="...">Jun 22, 2024</td>
    </tr>
    <!-- More rows -->
  </tbody>
</table>
```

---

## Caching

| Endpoint | Cache Duration | Cache Key |
|----------|---------------|-----------|
| `?incident={name}` | 15 seconds | `inc_{normalized_name}` |
| `?type=past` | 300 seconds (5 min) | `past_incidents` |

Cache is managed via `CacheService.getScriptCache()`.

---

## Data Source

### Google Sheets Structure

The script reads from two sheets in the bound spreadsheet:

#### IncidentStatus

| Column | Index | Field |
|--------|-------|-------|
| A | 0 | Incident name |
| B | 1 | Status update URL |
| C | 2 | Check-in location |
| D | 3 | Check-in address(es) |
| E | 4 | Shelter info |
| F | 5 | Shelter address(es) |
| G | 6 | Road closures |
| H | 7 | Small animal location |
| I | 8 | Small animal address |
| J | 9 | Large animal location |
| K | 10 | Large animal address |

#### PastIncidents

| Column | Index | Field |
|--------|-------|-------|
| A | 0 | Incident name |
| B | 1 | Start date |
| C | 2 | Lifted date |

---

## Error Handling

| Scenario | Response |
|----------|----------|
| Missing incident parameter | Empty `<div></div>` |
| Incident not found | Warning card with message |
| Sheet not found | Warning card with configuration error |
| No data in sheet | Warning card with "No data available" |
| Script error | Warning card with generic error message |

All errors are logged via `Logger.log()`.

---

## Security Considerations

### Input Sanitization

All user input is sanitized before output:

```javascript
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', 
    '"': '&quot;', "'": '&#39;'
  })[c]);
}
```

### URL Normalization

URLs from the spreadsheet are normalized to ensure valid `https://` protocol:

```javascript
function normalizeUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (/^https?:/i.test(url)) return url.replace(/^(https?:)/i, '$1//');
  return 'https://' + url;
}
```

---

## Deployment

### Initial Setup

1. Create a new Google Apps Script project
2. Paste `code.gs` content
3. Bind to a Google Sheet with required tabs
4. Deploy as web app:
   - Execute as: **Me**
   - Who has access: **Anyone**

### Updating

1. Edit code in Apps Script editor
2. Deploy → Manage deployments
3. Edit existing deployment or create new version
4. Update `statusBaseUrl` in HTML files if deployment ID changes

---

## Rate Limits

Google Apps Script quotas apply:

| Quota | Consumer Account | Workspace Account |
|-------|------------------|-------------------|
| URL Fetch calls | 20,000/day | 100,000/day |
| Script runtime | 6 min/execution | 30 min/execution |
| Triggers | 20/user/script | 20/user/script |

---

## Testing

### Manual Testing

```bash
# Test incident endpoint
curl "https://script.google.com/.../exec?incident=Test"

# Test past incidents
curl "https://script.google.com/.../exec?type=past"
```

### Browser Testing

Open the deployment URL directly in a browser to see raw HTML output.
