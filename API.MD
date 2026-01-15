# ReadyLaPlata Data Reference

**JSON Data File Formats**

ReadyLaPlata uses static JSON files for incident data, making deployment simple and eliminating server-side dependencies.

---

## Data Files

| File | Purpose | Used By |
|------|---------|---------|
| `incident.json` | Active incident support resources | `evac.html` |
| `pastincident.json` | Historical incident records | `overview.html` |

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

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Incident name (must match ArcGIS `incident` field, case-insensitive) |
| `statusLink` | string | URL to official status update page |
| `checkIn` | string | Check-in location name/details (use `\n` for line breaks) |
| `checkInAddr` | string | Check-in address for Google Maps directions |
| `shelters` | string | Shelter name/details (use `\n` for line breaks) |
| `sheltersAddr` | string | Shelter address for directions |
| `road` | string | Road closures list (use `\n` to separate multiple roads) |
| `smallAnimals` | string | Small animal evacuation location |
| `smallAnimalsAddr` | string | Small animal location address |
| `largeAnimals` | string | Large animal evacuation location |
| `largeAnimalsAddr` | string | Large animal location address |

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

### Usage in evac.html

```javascript
const CONFIG = {
  statusJsonUrl: 'incident.json',
  // ...
};

// Fetched and matched by incident name (case-insensitive)
const res = await fetch(CONFIG.statusJsonUrl);
const incidents = await res.json();
const data = incidents.find(inc => 
  inc.name && inc.name.toLowerCase() === INCIDENT.toLowerCase()
);
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

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Incident name |
| `startDate` | string | Date evacuations began (ISO format: YYYY-MM-DD) |
| `liftedDate` | string | Date evacuations were lifted (ISO format: YYYY-MM-DD) |

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
  },
  {
    "name": "Elkhorn Fire",
    "startDate": "2025-07-26",
    "liftedDate": "2025-08-04"
  },
  {
    "name": "Rim Road Fire",
    "startDate": "2025-07-26",
    "liftedDate": "2025-07-28"
  },
  {
    "name": "UTE-63 Fire",
    "startDate": "2025-07-13",
    "liftedDate": "2025-07-21"
  },
  {
    "name": "2025 Annual Wildfire Exercise",
    "startDate": "2025-04-21",
    "liftedDate": "2025-04-25"
  },
  {
    "name": "Enterprise Pipeline Spill",
    "startDate": "2024-12-05",
    "liftedDate": "2024-12-05"
  }
]
```

### Usage in overview.html

```javascript
const CONFIG = {
  pastIncidentsJsonUrl: 'pastincident.json',
  // ...
};

// Fetched and sorted by most recent first
const res = await fetch(CONFIG.pastIncidentsJsonUrl);
const incidents = await res.json();

// Sort by liftedDate descending
incidents.sort((a, b) => {
  const dateA = new Date(b.liftedDate || b.startDate || 0);
  const dateB = new Date(a.liftedDate || a.startDate || 0);
  return dateA - dateB;
});
```

### Date Display Format

Dates are displayed in user-friendly format:

```javascript
const formatDate = val => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });
};
// "2025-10-16" → "Oct 16, 2025"
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

### Update Past Incidents

1. Edit `pastincident.json` directly
2. Use ISO date format (YYYY-MM-DD)
3. Upload updated file to web server

---

## ArcGIS REST API

The application also queries ArcGIS Feature Services directly for zone data.

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

### Incident Not Found

If no matching incident in JSON:
```
No Status Information
No detailed status information is currently available for [incident name].
Check back later for updates on shelters, check-in locations, and road closures.
```

### Empty pastincident.json

If the file is empty or contains no records:
```
No past incidents recorded.
```

---

## Migration from Google Apps Script

The application previously used Google Apps Script for data. To migrate:

1. Export data from Google Sheets to JSON format
2. Create `incident.json` and `pastincident.json` files
3. Update CONFIG in HTML files:
   ```javascript
   // Old (Apps Script)
   statusBaseUrl: 'https://script.google.com/macros/s/.../exec'
   
   // New (JSON files)
   statusJsonUrl: 'incident.json'
   pastIncidentsJsonUrl: 'pastincident.json'
   ```
4. Deploy JSON files alongside HTML files
