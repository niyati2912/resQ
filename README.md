# ResQ

<p align="center">
  <strong>Emergency Blood Support & Donor Discovery Platform</strong>
</p>

<p align="center">
  A frontend-first emergency blood support platform designed to reduce the time required to find compatible donors, hospitals, and blood banks.
</p>

---

## Overview

ResQ is a web application built around one simple idea:

> When someone needs blood urgently, finding the right support should take as little time as possible.

The application combines donor discovery, emergency blood requests, blood-group compatibility, donation eligibility screening, and hospital/blood-bank discovery into one interface.

ResQ is currently a frontend prototype. Data is stored locally using browser `localStorage`, while the medical-location map uses public OpenStreetMap services.

---

## Key Features

### Emergency Blood Request

The emergency workflow is designed to be shorter than the normal donor workflow.

Users:

1. Select the required blood group.
2. Continue to the emergency details.
3. Enter patient and hospital information.
4. Submit the request.
5. Receive matching donor information based on blood compatibility and city.

Emergency requests are stored locally under:

```text
resqEmergencyRequests
```

Each request contains:

```text
id
patientName
bloodGroup
city
hospital
contact
units
urgency
status
createdAt
```

---

### Blood Donor Registration

Donors can register with:

- Full name
- Blood group
- Phone number
- City
- Age
- Availability

Basic validation is performed before the donor is stored.

Donor records are stored under:

```text
resqDonors
```

---

### Find Blood

The donor-search page allows users to search by:

- Blood group
- City

Only donors marked as available are returned.

The current matching system also considers blood-group compatibility rather than simply requiring an exact blood-group match.

---

### Hospital & Blood Bank Map

ResQ contains an embedded interactive medical-location map.

It does not require a Google Maps API key.

The map uses:

- Leaflet.js
- OpenStreetMap
- Nominatim
- Overpass API

The search flow is:

```text
City
  ↓
Nominatim
  ↓
City coordinates
  ↓
Overpass
  ↓
OpenStreetMap medical facilities
  ↓
Leaflet map
```

The application can search for mapped:

- Hospitals
- Clinics
- Blood banks
- Blood centres

Users can:

- Search an Indian city
- Filter hospitals
- Filter blood banks
- View facilities on the map
- Open facility information
- View available address/phone information
- Open directions

The map represents facility locations. It does not guarantee real-time blood inventory.

---

### Blood Compatibility Checker

The compatibility page lets the user select:

- Recipient blood group
- Donor blood group

The application then determines whether the donor group is compatible with the selected recipient according to the compatibility rules implemented in the project.

---

### Donation Eligibility Checker

The eligibility page performs a basic project-level screening using:

- Age
- Weight
- Time since previous donation
- Current health status

This is an educational screening feature and is not a substitute for professional donor assessment.

---

### Dashboard

The dashboard provides a quick overview of locally stored ResQ data.

It displays:

- Total donors
- Available donors
- Total emergency requests
- Critical requests
- Recent donors
- Recent emergency requests

---

### Navigation & UI

The application currently includes:

- ResQ sidebar navigation
- Collapsible navigation
- Emergency shortcut
- Light/dark theme support
- English/Hindi/Punjabi language selector
- Account/login/signup UI
- ResQ branding and custom logo

---

## Application Flow

### Normal User Flow

```text
Home
  │
  ├── Find Blood
  │      └── Search available donors
  │
  ├── Hospitals
  │      └── Search hospitals & blood banks
  │
  ├── Eligibility
  │      └── Basic donation screening
  │
  ├── Compatibility
  │      └── Check donor/recipient compatibility
  │
  └── Emergency
         └── Request blood immediately
```

### Emergency Flow

```text
I Need Blood Now
        ↓
Select Blood Group
        ↓
Continue
        ↓
Patient + Location + Hospital Details
        ↓
Submit Request
        ↓
Save Emergency Request
        ↓
Find Compatible Donors
        ↓
Hospital / Blood Bank Support
```

---

## Tech Stack

| Area | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 |
| Application logic | JavaScript |
| Icons | Lucide |
| Map | Leaflet.js |
| Map data | OpenStreetMap |
| City search | Nominatim |
| POI search | Overpass API |
| Local persistence | Browser localStorage |
| Fonts | Google Fonts |

---

## Project Structure

```text
ResQ/
│
├── assets/
│   └── resq-logo.png
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── compatibility.js
│   ├── dashboard.js
│   ├── donor.js
│   ├── eligibility.js
│   ├── emergency.js
│   └── hospitals.js
│
├── index.html
├── find-blood.html
├── hospitals.html
├── dashboard.html
├── eligibility.html
├── compatibility.html
├── emergency.html
├── login.html
├── signup.html
├── resources.html
│
└── README.md
```

---

## Page Responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Main landing page |
| `find-blood.html` | Donor search and contact flow |
| `hospitals.html` | Hospital and blood-bank map |
| `dashboard.html` | Donor/request statistics |
| `eligibility.html` | Donation eligibility checker |
| `compatibility.html` | Blood compatibility checker |
| `emergency.html` | Emergency blood-request flow |
| `login.html` | Login interface |
| `signup.html` | Signup interface |
| `resources.html` | Blood donation resources |

---

## JavaScript Responsibilities

| File | Responsibility |
|---|---|
| `app.js` | Global UI behaviour such as navigation/theme/language |
| `donor.js` | Donor registration and validation |
| `find-blood.js` | Donor search and contact modal |
| `hospitals.js` | City search, Overpass queries and map rendering |
| `emergency.js` | Emergency blood request workflow |
| `eligibility.js` | Eligibility calculations |
| `compatibility.js` | Blood compatibility logic |
| `dashboard.js` | Dashboard statistics and recent records |

---

## Data Storage

The current prototype does not use a backend database.

### Donors

```text
localStorage["resqDonors"]
```

### Emergency Requests

```text
localStorage["resqEmergencyRequests"]
```

This makes the current prototype easy to run without server configuration.

A production version should move this data to a secure backend.

---

## Running ResQ

### 1. Clone the repository

```bash
git clone <repository-url>
cd ResQ
```

### 2. Open in VS Code

Open the project folder in VS Code.

### 3. Run with a local server

Use VS Code Live Server or another local HTTP server.

For example:

```text
index.html
→ Open with Live Server
```

The application should then open in the browser.

---

## Map Setup

No Google Maps API key is required.

The hospital page loads Leaflet and queries public OpenStreetMap services.

Example:

```text
Search: Ambala
```

The application:

1. Finds Ambala using Nominatim.
2. Gets its coordinates.
3. Sends a query to Overpass.
4. Retrieves mapped hospitals and blood banks around the city.
5. Displays them on the embedded Leaflet map.

Because OpenStreetMap is community-maintained, coverage can vary between cities.

---

## Medical Disclaimer

ResQ is a software project/prototype.

The eligibility checker and compatibility checker are intended for educational demonstration only.

Actual:

- Blood transfusion compatibility
- Donor eligibility
- Blood availability
- Emergency treatment
- Medical decisions

must be confirmed by qualified healthcare professionals and authorized medical facilities.

---

## Current Limitations

The current version is intentionally frontend-first.

### No backend

Data is currently stored in browser `localStorage`.

### No real authentication

Login and signup are currently UI flows and are not connected to a production authentication system.

### No guaranteed live blood inventory

The map finds medical facilities but does not know whether a facility currently has a particular blood group available.

### OpenStreetMap coverage

A facility may not appear if it has not been mapped or tagged correctly in OpenStreetMap.

### No real-time notifications

Donors are not currently notified when a matching emergency request is created.

---

## Roadmap

### Completed

- [x] ResQ landing page
- [x] Sidebar navigation
- [x] Donor registration
- [x] Donor search
- [x] Emergency request workflow
- [x] Blood compatibility checker
- [x] Donation eligibility checker
- [x] Dashboard
- [x] Embedded medical map
- [x] Indian city search
- [x] Hospital discovery
- [x] Blood-bank discovery
- [x] Light/dark theme
- [x] Language selector

### Next

- [ ] Emergency popup from homepage
- [ ] Blood donation news section
- [ ] Meet Our Doctors section
- [ ] Better emergency donor matching
- [ ] Improved mobile sidebar
- [ ] Verified hospital/blood-bank information
- [ ] Improved blood-bank availability flow

### Production Direction

- [ ] Backend API
- [ ] Database
- [ ] Secure authentication
- [ ] Real-time donor availability
- [ ] Real-time blood inventory
- [ ] Donor notifications
- [ ] Emergency request matching
- [ ] Hospital/blood-bank verification
- [ ] Production security and privacy controls

---

## Team Development Notes

Before modifying a feature, check which JavaScript file owns that feature.

Avoid putting feature-specific logic into `app.js`.

Keep:

```text
Global UI
    → app.js

Donors
    → donor.js

Donor search
    → find-blood.js

Hospitals / map
    → hospitals.js

Emergency
    → emergency.js

Eligibility
    → eligibility.js

Compatibility
    → compatibility.js

Dashboard
    → dashboard.js
```

When changing the HTML structure, check the corresponding JavaScript selectors before testing.

---

## Project Status

**Status:** Active frontend prototype

**Architecture:** Multi-page frontend application

**Backend:** Not implemented

**Database:** Browser localStorage

**Maps:** Leaflet + OpenStreetMap + Nominatim + Overpass

**Authentication:** Prototype UI

**API key required for map:** No
