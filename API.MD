# ReadyLaPlata Data Reference

**JSON Data File Formats**

ReadyLaPlata uses static JSON files for all content configuration, making deployment simple and eliminating server-side dependencies.

---

## Data Files

| File | Purpose | Used By |
|------|---------|---------|
| `incident.json` | Active incident support resources | `evac.html` |
| `pastincident.json` | Historical incident records | `overview.html` |
| `announcement.json` | Site-wide announcement content | All pages |

---

## incident.json

Contains support resources for active incidents (shelters, check-in locations, road closures, animal evacuation).

### Schema

```json
[
  {
    "name": "string",
    "statusLink": "string",
    "checkIn": "string",
    "checkInAddr": "string",
    "shelters": "string",
    "sheltersAddr": "string",
    "road": "string",
    "smallAnimals": "string",
    "smallAnimalsAddr": "string",
    "largeAnimals": "string",
    "largeAnimalsAddr": "string"
  }
]
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **Yes** | Incident name (must match ArcGIS `incident` field, case-insensitive) |
| `statusLink` | string | No | URL to official status update page |
| `checkIn` | string | No | Check-in location name/details (use `\n` for line breaks) |
| `checkInAddr` | string | No | Check-in address for Google Maps directions |
| `shelters` | string | No | Shelter name/details (use `\n` for line breaks) |
| `sheltersAddr` | string | No | Shelter address for directions |
| `road` | string | No | Road closures list (use `\n` to separate multiple roads) |
| `smallAnimals` | string | No | Small animal evacuation location |
| `smallAnimalsAddr` | string | No | Small animal location address |
| `largeAnimals` | string | No | Large animal evacuation location |
| `largeAnimalsAddr` | string | No | Large animal location address |

### Example

```json
[
  {
    "name": "Mesa Test Fire",
    "statusLink": "lpcgov.org",
    "checkIn": "Durango High School\nRapid Tag 8a-4p",
    "checkInAddr": "Durango High School",
    "shelters": "La Plata County Fairgrounds",
    "sheltersAddr": "2500 Main Ave, Durango, CO 81301",
    "road": "CR 501\nCR 502\nCR 503",
    "smallAnimals": "La Plata County Humane Society",
    "smallAnimalsAddr": "1111 S Camino Del Rio, Durango, CO 81303",
    "largeAnimals": "La Plata County Fairgrounds",
    "largeAnimalsAddr": "2500 Main Ave, Durango, CO 81301"
  },
  {
    "name": "Endlich Test Fire",
    "statusLink": "lpcgov.org",
    "checkIn": "Durango High School\nRapid Tag 8a-4p",
    "checkInAddr": "Durango High School",
    "shelters": "La Plata County Fairgrounds",
    "sheltersAddr": "2500 Main Ave, Durango, CO 81301",
    "road": "CR 401\nCR 502\nCR 504",
    "smallAnimals": "La Plata County Humane Society",
    "smallAnimalsAddr": "1111 S Camino Del Rio, Durango, CO 81303",
    "largeAnimals": "La Plata County Fairgrounds",
    "largeAnimalsAddr": "2500 Main Ave, Durango, CO 81301"
  }
]
```

### Empty State

When no incidents are active:
```json
[]
```

---

## pastincident.json

Contains historical incident records displayed in the Past Incidents table on the overview page.

### Schema

```json
[
  {
    "name": "string",
    "startDate": "string (YYYY-MM-DD)",
    "liftedDate": "string (YYYY-MM-DD)"
  }
]
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **Yes** | Incident name |
| `startDate` | string | **Yes** | Date evacuations began (ISO format: YYYY-MM-DD) |
| `liftedDate` | string | **Yes** | Date evacuations were lifted (ISO format: YYYY-MM-DD) |

### Example

```json
[
  {
    "name": "North Vallecito Flooding",
    "startDate": "2025-10-10",
    "liftedDate": "2025-10-16"
  },
  {
    "name": "CR 250 Hazmat",
    "startDate": "2025-09-29",
    "liftedDate": "2025-09-29"
  },
  {
    "name": "Blue Ridge Fire",
    "startDate": "2025-08-15",
    "liftedDate": "2025-08-18"
  }
]
```

### Date Display Format

Dates are displayed in user-friendly format:
```
"2025-10-16" → "Oct 16, 2025"
```

---

## announcement.json

Controls the site-wide announcement system (bell icon and modal overlay). Content is loaded dynamically at runtime.

### Schema

```json
{
  "enabled": "boolean",
  "autoOpen": "boolean",
  "title": "string",
  "subtitle": "string",
  "badge": "string",
  "paragraphs": ["string"],
  "bulletPoints": ["string"],
  "contact": {
    "title": "string",
    "email": "string",
    "phone": "string"
  },
  "primaryButton": {
    "text": "string",
    "url": "string"
  },
  "dismissButton": "string"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | **Yes** | `true` = show announcement, `false` = hide completely |
| `autoOpen` | boolean | No | `true` = auto-popup on page load, `false` = only on bell click |
| `title` | string | **Yes** | Main heading text |
| `subtitle` | string | No | Smaller text under title |
| `badge` | string | No | Badge label (e.g., "Official Notice") |
| `paragraphs` | array | **Yes** | Array of paragraph strings (supports `<strong>` for bold) |
| `bulletPoints` | array | No | Array of bullet point strings |
| `contact` | object | No | Contact information section |
| `contact.title` | string | No | Contact section heading |
| `contact.email` | string | No | Email address (auto-linked) |
| `contact.phone` | string | No | Phone number (auto-linked) |
| `primaryButton` | object | No | Main action button |
| `primaryButton.text` | string | No | Button label |
| `primaryButton.url` | string | No | Button destination URL |
| `dismissButton` | string | No | Dismiss button text (default: "Close") |

### Example: Full Announcement

```json
{
  "enabled": true,
  "autoOpen": true,
  "title": "CodeRED Security Update",
  "subtitle": "Important information about your alert account",
  "badge": "Official Notice",
  "paragraphs": [
    "We are reaching out to share an important update regarding the security of our alert system <strong>CodeRED</strong>.",
    "Out of an abundance of caution, <strong>we recommend that all users who currently have an account change their password</strong>.",
    "Creating an account allows you to:"
  ],
  "bulletPoints": [
    "Review and update your contact information",
    "Manage alert preferences",
    "Ensure your information stays current"
  ],
  "contact": {
    "title": "Questions or Need Assistance?",
    "email": "oem@co.laplata.co.us",
    "phone": "970-382-6275"
  },
  "primaryButton": {
    "text": "Manage My CodeRED Account",
    "url": "https://public.coderedweb.com/CNE/en-US/"
  },
  "dismissButton": "I'll do this later"
}
```

### Example: Disabled

```json
{
  "enabled": false
}
```

### Example: Minimal (No Auto-Open)

```json
{
  "enabled": true,
  "autoOpen": false,
  "title": "Quick Notice",
  "subtitle": "Brief update",
  "paragraphs": [
    "Your message here."
  ],
  "dismissButton": "Close"
}
```

### Session Persistence

- When a user dismisses the announcement, it won't auto-open again during that browser session
- Users can still click the bell icon to view dismissed announcements
- Closing and reopening the browser resets this behavior

---

## Shared JavaScript Module

The `shared.js` module provides common utilities used across all pages.

### Exported Functions

| Function | Purpose |
|----------|---------|
| `$` | DOM element selector (`document.getElementById` shorthand) |
| `escHTML` | HTML escape function (XSS prevention) |
| `escapeQuery` | SQL query escape for ArcGIS WHERE clauses |
| `formatTimestamp` | Returns formatted current timestamp |
| `updateTimestamp` | Updates an element with current timestamp |
| `createChip` | Creates incident chip DOM element |
| `sortIncidents` | Sorts incident array with target first |
| `getIncidentParam` | Parses and validates `?incident=` URL parameter |
| `initCoderedOverlay` | Initializes CodeRED modal |
| `initAnnouncement` | Loads and initializes announcement from JSON |
| `BRAND` | Frozen object of brand color constants |

### Usage

```javascript
const { $, escHTML, initAnnouncement } = ReadyLaPlata;

// Initialize announcement system
initAnnouncement(DOM, 'announcement.json');
```

---

## Timestamp Format

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

## Updating Data

### Add New Active Incident

1. Add entry to `incident.json` with all support resource details
2. Add corresponding features to ArcGIS Feature Service with matching `incident` field
3. Upload updated `incident.json` to web server

### Close Incident

1. Remove entry from `incident.json` (or leave empty array `[]` if no active incidents)
2. Add entry to `pastincident.json` with lifted date
3. Update ArcGIS features (remove or archive)
4. Upload both updated JSON files

### Update Announcement

1. Edit `announcement.json` with new content
2. Set `enabled: true` and `autoOpen: true` if needed
3. Upload updated file to web server
4. Changes take effect immediately (no code changes required)

### Disable Announcement

1. Edit `announcement.json`
2. Set `"enabled": false`
3. Upload updated file

---

## ArcGIS REST API

The application queries ArcGIS Feature Services directly for zone data.

### Get Distinct Incident Names

```
GET /query
  ?where=1=1
  &outFields=incident
  &returnDistinctValues=true
  &returnGeometry=false
  &orderByFields=incident
  &f=json
```

### Get Zones for Incident

```
GET /query
  ?where=incident='East Canyon' AND STATUS IN ('Set','Go')
  &outFields=*
  &returnGeometry=false
  &f=json
```

### Get Incident Extent (for map zoom)

```
GET /query
  ?where=incident='East Canyon'
  &returnExtentOnly=true
  &f=json
```

---

## Error Handling

### Missing incident.json

If the file cannot be loaded, evac.html displays:
```
Error loading incident status.
```

### Incident Not Found in JSON

If no matching incident:
```
No Status Information
No detailed status information is currently available for [incident name].
```

### Empty pastincident.json

If the file is empty or contains no records:
```
No past incidents recorded.
```

### Missing announcement.json

If the file cannot be loaded:
- Bell icon is hidden
- No error displayed to user
- Warning logged to console

---

## Validation

Before uploading any JSON file, validate syntax at **https://jsonlint.com**

### Common Mistakes

1. Missing comma between items
2. Extra comma after last item
3. Unescaped quotes inside strings (use `\"`)
4. Using single quotes instead of double quotes
