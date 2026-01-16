# ReadyLaPlata JSON Editing Guide

Quick reference for manually updating the JSON config files.

---

## incident.json

**Purpose:** Active incident details (shelters, road closures, animal evacuation, etc.)

**When to edit:** When Power Automate is down or you need to make quick manual updates during an incident.

**Format in VS Code:** Open file → `Shift+Alt+F`

### Empty (no incidents)
```json
[]
```

### Single incident template
```json
[
  {
    "name": "INCIDENT NAME HERE",
    "statusLink": "https://www.facebook.com/laplatacountyoem",
    "checkIn": "Location Name\nAdditional details",
    "checkInAddr": "Full address for Google Maps directions",
    "shelters": "Shelter Name\nHours or details",
    "sheltersAddr": "Full address for directions",
    "road": "Road 1 closed\nRoad 2 closed\nRoad 3 closed",
    "smallAnimals": "Facility Name\nWhat animals accepted",
    "smallAnimalsAddr": "Full address for directions",
    "largeAnimals": "Facility Name\nWhat animals accepted",
    "largeAnimalsAddr": "Full address for directions"
  }
]
```

### Multiple incidents template
```json
[
  {
    "name": "First Fire",
    "statusLink": "https://www.facebook.com/laplatacountyoem",
    "checkIn": "Durango High School\nRapid Tag 8a-4p",
    "checkInAddr": "Durango High School, Durango, CO",
    "shelters": "La Plata County Fairgrounds",
    "sheltersAddr": "2500 Main Ave, Durango, CO 81301",
    "road": "CR 501\nCR 502",
    "smallAnimals": "La Plata County Humane Society",
    "smallAnimalsAddr": "1111 S Camino Del Rio, Durango, CO 81303",
    "largeAnimals": "La Plata County Fairgrounds",
    "largeAnimalsAddr": "2500 Main Ave, Durango, CO 81301"
  },
  {
    "name": "Second Fire",
    "statusLink": "https://www.facebook.com/laplatacountyoem",
    "checkIn": "Different Location",
    "checkInAddr": "Address here",
    "shelters": "Different Shelter",
    "sheltersAddr": "Address here",
    "road": "CR 301",
    "smallAnimals": "La Plata County Humane Society",
    "smallAnimalsAddr": "1111 S Camino Del Rio, Durango, CO 81303",
    "largeAnimals": "La Plata County Fairgrounds",
    "largeAnimalsAddr": "2500 Main Ave, Durango, CO 81301"
  }
]
```

### Field reference
| Field | What it does |
|-------|--------------|
| `name` | **Must match ArcGIS incident name exactly** |
| `statusLink` | URL for "View Status Update" button |
| `checkIn` | Check-in location info (`\n` for line breaks) |
| `checkInAddr` | Address for directions button |
| `shelters` | Shelter info |
| `sheltersAddr` | Shelter address for directions |
| `road` | Road closures (one per line with `\n`) |
| `smallAnimals` | Small animal evacuation info |
| `smallAnimalsAddr` | Address for directions |
| `largeAnimals` | Large animal evacuation info |
| `largeAnimalsAddr` | Address for directions |

---

## announcement.json

**Purpose:** Site-wide announcement banner (the bell icon popup)

**When to edit:** When you need to post a new announcement or disable the current one.

### Disable announcement completely
```json
{
  "enabled": false
}
```

### Enable but don't auto-popup (user must click bell)
```json
{
  "enabled": true,
  "autoOpen": false,
  "title": "Your Title",
  "subtitle": "Your subtitle",
  "paragraphs": [
    "Your message here."
  ],
  "primaryButton": {
    "text": "Button Text",
    "url": "https://example.com"
  },
  "dismissButton": "Close"
}
```

### Full announcement template
```json
{
  "enabled": true,
  "autoOpen": true,
  "title": "Announcement Title",
  "subtitle": "Brief description",
  "badge": "Official Notice",
  "paragraphs": [
    "First paragraph. Use <strong>bold</strong> if needed.",
    "Second paragraph.",
    "Third paragraph.",
    "Intro to bullet points:"
  ],
  "bulletPoints": [
    "First bullet point",
    "Second bullet point",
    "Third bullet point"
  ],
  "contact": {
    "title": "Questions or Need Assistance?",
    "email": "oem@co.laplata.co.us",
    "phone": "970-382-6275"
  },
  "primaryButton": {
    "text": "Take Action",
    "url": "https://example.com"
  },
  "dismissButton": "I'll do this later"
}
```

### Field reference
| Field | Required | What it does |
|-------|----------|--------------|
| `enabled` | Yes | `true` = show, `false` = hide completely |
| `autoOpen` | No | `true` = popup on page load, `false` = only on bell click |
| `title` | Yes | Main heading |
| `subtitle` | No | Smaller text under title |
| `badge` | No | Small badge label (e.g., "Official Notice") |
| `paragraphs` | Yes | Array of paragraphs (supports `<strong>` for bold) |
| `bulletPoints` | No | Array of bullet points |
| `contact` | No | Contact info section |
| `primaryButton` | No | Main action button |
| `dismissButton` | No | Text for dismiss button (default: "Close") |

---

## pastincident.json

**Purpose:** Historical incidents shown on the Overview page

**When to edit:** After an incident is fully resolved and evacuations are lifted.

### Empty (no past incidents)
```json
[]
```

### Single past incident
```json
[
  {
    "name": "Incident Name",
    "startDate": "2025-01-15",
    "liftedDate": "2025-01-18"
  }
]
```

### Multiple past incidents
```json
[
  {
    "name": "Spring Fire",
    "startDate": "2025-03-10",
    "liftedDate": "2025-03-15"
  },
  {
    "name": "Winter Storm",
    "startDate": "2025-01-05",
    "liftedDate": "2025-01-07"
  },
  {
    "name": "Fall Fire",
    "startDate": "2024-10-20",
    "liftedDate": "2024-10-25"
  }
]
```

### Field reference
| Field | What it does |
|-------|--------------|
| `name` | Incident name |
| `startDate` | Date evacuations started (YYYY-MM-DD) |
| `liftedDate` | Date evacuations lifted (YYYY-MM-DD) |

---

## Common mistakes to avoid

1. **Missing comma between items**
   ```json
   // WRONG
   { "name": "Fire 1" }
   { "name": "Fire 2" }
   
   // CORRECT
   { "name": "Fire 1" },
   { "name": "Fire 2" }
   ```

2. **Extra comma after last item**
   ```json
   // WRONG
   [
     { "name": "Fire 1" },
   ]
   
   // CORRECT
   [
     { "name": "Fire 1" }
   ]
   ```

3. **Unescaped quotes inside text**
   ```json
   // WRONG
   "checkIn": "Meet at "The Spot" building"
   
   // CORRECT
   "checkIn": "Meet at \"The Spot\" building"
   ```

4. **Using single quotes**
   ```json
   // WRONG
   { 'name': 'Fire' }
   
   // CORRECT
   { "name": "Fire" }
   ```

---

## Validation

Before uploading, paste your JSON into **https://jsonlint.com** to check for errors.
