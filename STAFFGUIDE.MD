# ReadyLaPlata Incident Update Guide

## Updating Incident Information

**File:** Excel table on OneDrive

### To Add or Update an Incident

1. Open the Excel file
2. Add a new row or edit existing row
3. Save the file
4. Website updates automatically in ~3 minutes

### Excel Columns

| Column | Example |
|--------|---------|
| name | `Mesa Fire` (must match ArcGIS) |
| statusLink | `lpcgov.org` |
| checkIn | `Durango High School` |
| checkInAddr | `2390 Main Ave, Durango, CO` |
| shelters | `La Plata County Fairgrounds` |
| sheltersAddr | `2500 Main Ave, Durango, CO 81301` |
| road | `CR 501` (use Alt+Enter for multiple) |
| smallAnimals | `La Plata County Humane Society` |
| smallAnimalsAddr | `1111 S Camino Del Rio, Durango, CO` |
| largeAnimals | `La Plata County Fairgrounds` |
| largeAnimalsAddr | `2500 Main Ave, Durango, CO 81301` |

### To Remove an Incident

1. Delete the row from Excel
2. Save the file

---

## If Automatic Updates Aren't Working

Contact GIS staff to manually transfer the file to the server.

**Server location:** `wwwroot/readylpc/incident.json`

---

## Recording Past Incidents

When evacuations are lifted, ask GIS staff to add the incident to `pastincident.json`.

---

## Questions?

- **Content questions:** Contact OEM
- **Technical issues:** Contact GIS
