# ReadyLaPlata Setup Guide

**Step-by-step deployment and configuration instructions**

---

## Prerequisites

Before starting, ensure you have:

- [ ] Access to a web server or static hosting service (GitHub Pages, Netlify, etc.)
- [ ] ArcGIS Online organizational account
- [ ] Access to the La Plata County Feature Services

---

## Step 1: Prepare Data Files

### incident.json

Create a JSON file for active incident support resources:

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

Create a JSON file for historical incident records:

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

**Note:** Use ISO date format (YYYY-MM-DD). The table will display as "Oct 16, 2025".

---

## Step 2: ArcGIS Configuration

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

## Step 3: Configure HTML Files

### Update evac.html

Find the CONFIG object and update:

```javascript
const CONFIG = {
  webmapId: 'YOUR_WEBMAP_ID_HERE',
  incidentLayerUrl: 'YOUR_FEATURE_SERVICE_URL_HERE',
  statusJsonUrl: 'incident.json',  // Path to your incident JSON file
  incidentField: 'incident',       // Verify this matches your field name
  statusValues: { SET: 'Set', GO: 'Go' }  // Verify these match your STATUS values
};
```

### Update overview.html

```javascript
const CONFIG = {
  incidentLayerUrl: 'YOUR_FEATURE_SERVICE_URL_HERE',
  pastIncidentsJsonUrl: 'pastincident.json',  // Path to your past incidents JSON
  incidentField: 'incident',
  mapCenter: [-107.8801, 37.2753],  // Adjust to your county center
  mapScale: 800000  // Adjust zoom level
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

### Configure Announcement System

In each HTML file, set the announcement toggle:

```javascript
// SHOW_ANNOUNCEMENT: shows the bell icon on all pages when true
// AUTO_OPEN_ANNOUNCEMENT: auto-opens the popup on HOME PAGE ONLY when true
const SHOW_ANNOUNCEMENT = true;   // Set to false to hide bell on all pages
const AUTO_OPEN_ANNOUNCEMENT = true;  // Only applies to index.html
```

---

## Step 4: Deploy Static Files

### File Checklist

Ensure you have all files:

```
readylaplata/
├── index.html
├── overview.html
├── evac.html
├── shared-styles.css
├── favicon.svg
├── incident.json
└── pastincident.json
```

### Upload to Web Server

**Option A: Traditional Web Server**

```bash
# Upload via FTP/SFTP
scp -r readylaplata/* user@yourserver:/var/www/readylaplata/
```

**Option B: GitHub Pages**

1. Create a repository with the files
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be at `https://username.github.io/repository/`

**Option C: Netlify/Vercel**

1. Create a repository with the files
2. Connect to your hosting provider
3. Deploy automatically on push

### Configure Domain (Optional)

1. Point `readylaplata.org` (or your domain) to your server
2. Configure SSL certificate (Let's Encrypt recommended)
3. Set up redirects if needed:
   ```
   / → /index.html
   ```

---

## Step 5: Verification

### Test Each Page

1. **index.html**
   - [ ] Page loads without errors
   - [ ] Incident chips appear (if active incidents exist in ArcGIS)
   - [ ] Bell icon appears (if SHOW_ANNOUNCEMENT = true)
   - [ ] Announcement modal opens on load (if AUTO_OPEN_ANNOUNCEMENT = true)
   - [ ] CodeRED modal opens/closes
   - [ ] Navigation to overview.html works
   - [ ] Timestamp shows timezone (e.g., "MST")

2. **overview.html**
   - [ ] Map loads and displays
   - [ ] Incident pins appear on map (if active incidents exist)
   - [ ] Past incidents table loads from pastincident.json
   - [ ] Bell icon appears but modal doesn't auto-open
   - [ ] Clicking pins navigates to evac.html
   - [ ] Home button navigates to index.html

3. **evac.html?incident=YourIncident**
   - [ ] Map zooms to incident
   - [ ] SET/GO zones display correctly
   - [ ] Incident status card loads from incident.json
   - [ ] Directions links work (Google Maps)
   - [ ] Bell icon appears but modal doesn't auto-open
   - [ ] Home button navigates to index.html

### Test Mobile

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify responsive layout at all breakpoints
- [ ] Verify modals close with tap outside

---

## Troubleshooting

### "No incidents found"

- Verify the `incident` field name matches in ArcGIS and CONFIG
- Check that Feature Service is publicly accessible
- Confirm there are features with the `incident` field populated

### Incident status not showing

- Check browser console for JSON fetch errors
- Verify `incident.json` is in the same directory as HTML files
- Confirm incident name in JSON matches ArcGIS exactly (case-insensitive)
- Check JSON syntax is valid (use a JSON validator)

### Past incidents table empty

- Verify `pastincident.json` exists and is accessible
- Check JSON syntax is valid
- Confirm file contains at least one record

### Map doesn't load

- Check browser console for errors
- Verify ArcGIS URLs are correct and accessible
- Confirm WebMap is shared publicly (or to your org)

### Bell icon not showing

- Verify `SHOW_ANNOUNCEMENT = true` in the HTML file
- Check that the CSS file (shared-styles.css) is loading

### Announcement modal opens on wrong page

- `AUTO_OPEN_ANNOUNCEMENT` only affects `index.html`
- On overview.html and evac.html, the modal never auto-opens
- Users can still click the bell to open it manually

---

## Updating Content

### Add New Active Incident

1. Add entry to `incident.json` with support resource details
2. Add corresponding features to ArcGIS Feature Service
3. Upload updated `incident.json` to server
4. Data appears immediately (no cache)

### Close Incident

1. Remove entry from `incident.json`
2. Add entry to `pastincident.json` with lifted date
3. Update ArcGIS features (remove or archive)
4. Upload both updated JSON files

### Update Announcement Content

1. Edit the announcement HTML in each file (index.html, overview.html, evac.html)
2. Update the title, body text, and links as needed
3. Upload updated HTML files

### Disable Announcement

Set in each HTML file:
```javascript
const SHOW_ANNOUNCEMENT = false;
```

This hides the bell icon on all pages.

---

## Maintenance

### Regular Checks

- [ ] Weekly: Verify all pages load correctly
- [ ] Monthly: Review incident.json and pastincident.json for accuracy
- [ ] Annually: Update ArcGIS SDK version (check for breaking changes)

### Backup

- Keep JSON files in version control
- Document any ArcGIS service changes
- Maintain copy of all HTML/CSS files

---

## Support

For technical issues:
- Check browser console for JavaScript errors
- Verify JSON file syntax
- Verify ArcGIS service status

For content updates:
- Contact La Plata County OEM
- Update JSON data files
- Coordinate with GIS team for map changes
