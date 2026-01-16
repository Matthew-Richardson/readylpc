# ReadyLaPlata Setup Guide

**Step-by-step deployment and configuration instructions**

---

## Prerequisites

Before starting, ensure you have:

- [ ] Access to a web server or static hosting service (GitHub Pages, Netlify, IIS, etc.)
- [ ] ArcGIS Online organizational account
- [ ] Access to the La Plata County Feature Services

---

## Step 1: Prepare Files

### File Checklist

```
readylaplata/
├── index.html           # Home page
├── overview.html        # Overview map page
├── evac.html            # Evacuation details page
├── shared.js            # Shared JavaScript module
├── shared-styles.css    # Shared stylesheet
├── favicon.svg          # Site favicon
├── incident.json        # Active incident data
├── pastincident.json    # Historical incidents
└── announcement.json    # Announcement content
```

---

## Step 2: Configure JSON Files

All content configuration is done through JSON files—no code changes required for content updates.

### incident.json

Active incident support resources. Start with empty array if no incidents:

```json
[]
```

Or with incident data:

```json
[
  {
    "name": "Example Fire",
    "statusLink": "https://lpcgov.org/updates",
    "checkIn": "Durango High School\nRapid Tag 8a-4p",
    "checkInAddr": "2390 Main Ave, Durango, CO",
    "shelters": "La Plata County Fairgrounds",
    "sheltersAddr": "2500 Main Ave, Durango, CO 81301",
    "road": "CR 240 at mile marker 5\nCR 250 closed entirely",
    "smallAnimals": "La Plata County Humane Society",
    "smallAnimalsAddr": "1111 S Camino del Rio, Durango, CO",
    "largeAnimals": "La Plata County Fairgrounds",
    "largeAnimalsAddr": "2500 Main Ave, Durango, CO 81301"
  }
]
```

**Note:** The `name` field must match the `incident` field in your ArcGIS Feature Service (case-insensitive).

### pastincident.json

Historical incident records:

```json
[
  {
    "name": "North Vallecito Flooding",
    "startDate": "2025-10-10",
    "liftedDate": "2025-10-16"
  },
  {
    "name": "Blue Ridge Fire",
    "startDate": "2025-08-15",
    "liftedDate": "2025-08-18"
  }
]
```

**Note:** Use ISO date format (YYYY-MM-DD). Displayed as "Oct 16, 2025".

### announcement.json

Site-wide announcement content:

**To disable announcement:**
```json
{
  "enabled": false
}
```

**Full announcement:**
```json
{
  "enabled": true,
  "autoOpen": true,
  "title": "Announcement Title",
  "subtitle": "Brief description",
  "badge": "Official Notice",
  "paragraphs": [
    "First paragraph with <strong>bold</strong> support.",
    "Second paragraph."
  ],
  "bulletPoints": [
    "First bullet",
    "Second bullet"
  ],
  "contact": {
    "title": "Questions?",
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

See `JSON-EDITING-GUIDE.md` for complete reference and templates.

---

## Step 3: ArcGIS Configuration

### Required Services

Ensure these services exist and are accessible:

1. **Feature Service** with evacuation zones
   - Must have `incident` field (text)
   - Must have `STATUS` field with values `Set` or `Go`
   - Must have `zonename` field
   
2. **WebMap** (for evac.html)
   - Should include the Feature Service
   - Configure symbology for SET (yellow) and GO (green) zones
   - Add any additional layers (road closures, info points, etc.)

### Get Service URLs

1. **Feature Service URL:**
   - Go to ArcGIS Online → Content → Your Feature Service
   - Click on the layer → Copy URL
   - Format: `https://services2.arcgis.com/{org}/ArcGIS/rest/services/{name}/FeatureServer/0`

2. **WebMap ID:**
   - Go to ArcGIS Online → Content → Your WebMap
   - Copy the Item ID from the URL or Details page
   - Format: 32-character alphanumeric string

---

## Step 4: Update HTML Configuration (If Needed)

Only needed if using different ArcGIS services than the defaults.

### Update evac.html

Find the CONFIG object:

```javascript
const CONFIG = {
  webmapId: 'YOUR_WEBMAP_ID_HERE',
  incidentLayerUrl: 'YOUR_FEATURE_SERVICE_URL_HERE',
  statusJsonUrl: 'incident.json',
  incidentField: 'incident',
  statusValues: { SET: 'Set', GO: 'Go' }
};
```

### Update overview.html

```javascript
const CONFIG = {
  incidentLayerUrl: 'YOUR_FEATURE_SERVICE_URL_HERE',
  pastIncidentsJsonUrl: 'pastincident.json',
  incidentField: 'incident',
  mapCenter: [-107.8801, 37.2753],  // Adjust to your county center
  mapScale: 800000
};
```

### Update index.html

```javascript
const CONFIG = {
  mapUrl: 'evac.html',
  incidentLayerUrl: 'YOUR_FEATURE_SERVICE_URL_HERE/query',
  incidentField: 'incident'
};
```

---

## Step 5: Deploy

### Upload to Web Server

**Option A: Traditional Web Server (IIS, Apache, Nginx)**

Upload all files to your web root:
```bash
scp -r readylaplata/* user@yourserver:/var/www/readylaplata/
```

**Option B: GitHub Pages**

1. Create a repository with the files
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Site available at `https://username.github.io/repository/`

**Option C: Netlify/Vercel**

1. Create a repository with the files
2. Connect to hosting provider
3. Deploy automatically on push

### Configure Domain (Optional)

1. Point your domain to your server
2. Configure SSL certificate (Let's Encrypt recommended)
3. Set up redirects if needed

---

## Step 6: Verification

### Test Each Page

1. **index.html**
   - [ ] Page loads without console errors
   - [ ] Incident chips appear (if active incidents in ArcGIS)
   - [ ] Bell icon appears (if announcement enabled)
   - [ ] Announcement modal auto-opens (if autoOpen: true)
   - [ ] CodeRED modal opens/closes
   - [ ] Navigation to overview.html works

2. **overview.html**
   - [ ] Map loads and displays
   - [ ] Incident pins appear on map
   - [ ] Past incidents table loads
   - [ ] Bell icon appears but modal doesn't auto-open
   - [ ] Clicking pins navigates to evac.html
   - [ ] Home button works

3. **evac.html?incident=YourIncident**
   - [ ] Map zooms to incident
   - [ ] SET/GO zones display correctly
   - [ ] Incident status card loads
   - [ ] Directions links work (Google Maps)
   - [ ] Home button works

### Test Mobile

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive layout at all breakpoints
- [ ] Modals close with tap outside

---

## Troubleshooting

### "No incidents found"

- Verify `incident` field name matches in ArcGIS and CONFIG
- Check that Feature Service is publicly accessible
- Confirm features have `incident` field populated

### Incident status not showing

- Check browser console for JSON fetch errors
- Verify `incident.json` is in same directory as HTML files
- Confirm incident name in JSON matches ArcGIS exactly
- Validate JSON syntax at https://jsonlint.com

### Past incidents table empty

- Verify `pastincident.json` exists and is accessible
- Check JSON syntax is valid
- Confirm file contains at least one record

### Map doesn't load

- Check browser console for errors
- Verify ArcGIS URLs are correct and accessible
- Confirm WebMap is shared publicly

### Announcement not showing

- Check that `announcement.json` exists
- Verify `"enabled": true` is set
- Check browser console for fetch errors
- Validate JSON syntax

### Announcement won't auto-open

- Verify `"autoOpen": true` is set
- Clear browser session storage (or use incognito)
- Check that user hasn't previously dismissed it

---

## Updating Content

### Add New Active Incident

1. Add entry to `incident.json`
2. Add features to ArcGIS Feature Service with matching `incident` field
3. Upload updated `incident.json`

### Close Incident

1. Remove entry from `incident.json` (or leave `[]` if no incidents)
2. Add entry to `pastincident.json` with lifted date
3. Update ArcGIS features (remove or archive)
4. Upload both JSON files

### Update Announcement

1. Edit `announcement.json` with new content
2. Upload updated file
3. Changes take effect immediately

### Disable Announcement

Edit `announcement.json`:
```json
{
  "enabled": false
}
```

---

## Maintenance

### Regular Checks

- [ ] Weekly: Verify all pages load correctly
- [ ] Monthly: Review JSON files for accuracy
- [ ] Annually: Update ArcGIS SDK version (check for breaking changes)

### Backup

- Keep JSON files in version control
- Document any ArcGIS service changes
- Maintain copy of all files

---

## Support

For technical issues:
- Check browser console for JavaScript errors
- Verify JSON file syntax at https://jsonlint.com
- Verify ArcGIS service status

For content updates:
- See `JSON-EDITING-GUIDE.md` for templates
- Contact La Plata County OEM for content questions
