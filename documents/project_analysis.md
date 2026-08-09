# ResQ — Team Documentation

## 1. What ResQ Is

ResQ is an emergency blood-support web application.

The application is designed around a simple problem:

When someone urgently needs blood, they should not have to search through multiple websites, contact random people, and separately find a hospital or blood bank.

ResQ brings these functions together:

- Emergency blood requests
- Blood donor registration
- Donor search
- Blood compatibility checking
- Donation eligibility screening
- Hospital discovery
- Blood-bank discovery
- Dashboard monitoring
- Blood donation resources

The project is currently a frontend prototype.

---

# 2. Important Architecture Decision

ResQ is currently a frontend-only application.

There is no backend database yet.

Data is stored using browser localStorage.

This means:

```text
Browser
   ↓
HTML
   ↓
CSS
   ↓
JavaScript
   ↓
localStorage
```

Different pages can access the same locally stored donor and emergency-request data.

This is useful for the prototype but will eventually need to be replaced with a backend.

---

# 3. Project Folder Structure

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
│   ├── donor.js
│   ├── find-blood.js
│   ├── hospitals.js
│   ├── emergency.js
│   ├── eligibility.js
│   ├── compatibility.js
│   └── dashboard.js
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

# 4. What Each Page Does

## `index.html`

This is the main ResQ landing page.

It is responsible for introducing ResQ and directing users toward:

- Emergency support
- Finding blood
- Hospitals
- Donor registration
- Other tools

The homepage is also where the emergency-first experience can later be implemented.

---

## `emergency.html`

This is one of the most important pages.

It uses a two-step emergency workflow.

### Step 1

The user selects:

```text
A+
A-
B+
B-
AB+
AB-
O+
O-
```

The blood-group buttons use:

```html
data-blood="A+"
```

The selected blood group is stored by `emergency.js`.

### Step 2

The user enters:

- Patient name
- City
- Hospital
- Contact number
- Units required
- Urgency

The request is then stored in:

```text
resqEmergencyRequests
```

The emergency page then attempts to find matching donors based on:

- Blood compatibility
- City
- Donor availability

---

# 5. Emergency JavaScript

File:

```text
js/emergency.js
```

Responsibilities:

- Blood-group selection
- Continue button
- Back button
- Form validation
- Emergency request creation
- localStorage persistence
- Compatible donor search
- Emergency success state
- Redirect to hospitals

Do not move this logic into `app.js`.

---

# 6. Blood Compatibility Logic

The current donor compatibility data is:

```javascript
const bloodCompatibility = {

    "A+": [
        "A+",
        "A-",
        "O+",
        "O-"
    ],

    "A-": [
        "A-",
        "O-"
    ],

    "B+": [
        "B+",
        "B-",
        "O+",
        "O-"
    ],

    "B-": [
        "B-",
        "O-"
    ],

    "AB+": [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ],

    "AB-": [
        "A-",
        "B-",
        "AB-",
        "O-"
    ],

    "O+": [
        "O+",
        "O-"
    ],

    "O-": [
        "O-"
    ]

};
```

This logic is used for donor matching and compatibility checking.

---

# 7. `find-blood.html`

This page searches for available donors.

The user enters:

- Blood group
- City

The JavaScript searches the donor list and returns donors whose:

```text
blood group
+
city
+
availability
```

match the search.

A contact modal is available for donor contact information.

---

# 8. `donor.js`

File:

```text
js/donor.js
```

Handles donor registration.

The donor form collects:

- Name
- Blood group
- Phone
- City
- Age
- Availability

Validation includes:

- Name length
- Blood group selection
- 10-digit phone number
- City
- Age between 18 and 65
- Availability

The donor is stored under:

```text
resqDonors
```

---

# 9. `hospitals.html`

This is the medical-location page.

It contains:

- City search
- Map
- Hospital filter
- Blood-bank filter
- Medical facility results
- Facility popups
- Directions

The map is embedded directly into ResQ.

It does not redirect the user to another map website for the primary map experience.

---

# 10. Map Architecture

The map uses four technologies.

## Leaflet

Leaflet renders the interactive map in the browser.

## OpenStreetMap

OpenStreetMap provides the map data/tiles.

## Nominatim

Nominatim is used to turn a city search into coordinates.

Example:

```text
Ambala
```

becomes approximately:

```text
latitude
longitude
```

## Overpass

Overpass is then used to query OpenStreetMap objects around those coordinates.

The query searches for medical facilities such as:

```text
hospital
clinic
blood_bank
blood_centre
blood_center
```

---

# 11. Map Flow

```text
User
 │
 │ enters "Ambala"
 ▼
hospitals.js
 │
 ▼
Nominatim
 │
 │ city coordinates
 ▼
Overpass API
 │
 │ hospitals / blood banks
 ▼
hospitals.js
 │
 ▼
Leaflet
 │
 ▼
Markers on ResQ map
```

---

# 12. Map Search Radius

The current Overpass query searches approximately:

```text
15 km
```

around the searched city coordinates.

If the project later needs wider coverage, this value can be increased.

Be careful with very large search areas because Overpass queries can become slow.

---

# 13. Map Result Types

Every result is classified as either:

```text
hospital
```

or:

```text
blood-bank
```

Blood-bank classification can come from:

- `healthcare=blood_bank`
- `healthcare=blood_centre`
- `healthcare=blood_center`
- `amenity=blood_bank`
- relevant facility names

---

# 14. Map Limitations

The map does NOT mean:

```text
Hospital exists
=
Blood is available
```

It only means that a medical facility is mapped at that location.

Actual blood availability needs to be verified with the facility or an official blood-stock service.

OpenStreetMap coverage also varies by location.

If a hospital is missing from the search, it may simply not be mapped or tagged correctly in OpenStreetMap.

---

# 15. `eligibility.html`

This page performs a basic educational donor screening.

Inputs:

```text
Age
Weight
Last donation
Current health status
```

The current project-level rules check:

- Age
- Minimum weight
- Donation interval
- Current health status

The result is displayed on the page.

This should remain clearly marked as a project-level educational checker.

---

# 16. `compatibility.html`

This page provides the blood compatibility checker.

Inputs:

```text
Recipient
Donor
```

The JavaScript checks the donor group against the compatibility mapping.

Result:

```text
Compatible Match
```

or:

```text
Not Compatible
```

---

# 17. `dashboard.html`

The dashboard reads stored data.

It currently displays:

```text
Total Donors
Available Donors
Blood Requests
Critical Requests
```

It also displays:

- Recent donors
- Recent emergency requests

The dashboard does not currently use a backend.

---

# 18. localStorage Keys

These are important.

## Donors

```text
resqDonors
```

## Emergency Requests

```text
resqEmergencyRequests
```

If someone changes one of these keys in JavaScript, every page using that data must be updated.

---

# 19. Global `app.js`

`app.js` should contain global application behaviour.

Examples:

- Sidebar opening
- Sidebar collapsing
- Theme switching
- Language selector
- Active navigation state

Feature-specific logic should remain in feature-specific files.

For example:

```text
Emergency
→ emergency.js

Map
→ hospitals.js

Donors
→ donor.js
```

Do not put everything into `app.js`.

---

# 20. Navigation

The current sidebar contains:

```text
Main

Home
Find Blood
Hospitals
Dashboard

Tools

Eligibility
Compatibility
Resources

Account

Login
Sign Up

Emergency

I Need Blood Now
```

The emergency action should remain visually prominent.

---

# 21. Login & Signup

The current login and signup pages are UI prototypes.

They are NOT connected to:

- A database
- Authentication API
- User accounts
- Password storage

Do not treat them as real authentication yet.

The eventual architecture should use a backend authentication system.

---

# 22. Theme

The project supports light/dark theme behaviour.

Theme handling belongs in:

```text
app.js
```

and:

```text
style.css
```

Do not create separate CSS files for every theme unless there is a strong reason.

---

# 23. Language Selector

The UI currently exposes:

```text
English
Hindi
Punjabi
```

The language selector is part of the global navigation.

The actual translation system is still a frontend feature and can be expanded later.

---

# 24. Current Data Flow

### Donor

```text
Donor Form
    ↓
Validation
    ↓
Donor Object
    ↓
resqDonors
    ↓
Find Blood
    ↓
Dashboard
```

### Emergency Request

```text
Emergency Form
    ↓
Validation
    ↓
Emergency Object
    ↓
resqEmergencyRequests
    ↓
Dashboard
```

### Hospital Search

```text
City
    ↓
Nominatim
    ↓
Coordinates
    ↓
Overpass
    ↓
Medical Facilities
    ↓
Leaflet
```

---

# 25. Current Development Priority

The immediate product priorities are:

## Priority 1

Emergency flow.

The user should be able to reach blood support quickly.

## Priority 2

Hospital and blood-bank map.

The map should work inside the application.

## Priority 3

Donor matching.

The system should return useful compatible donors.

## Priority 4

Improve the homepage emergency experience.

Planned flow:

```text
Is this an emergency?
        │
        ├── Yes
        │    ↓
        │ Blood support
        │
        └── No
             ↓
          Normal ResQ
```

---

# 26. Planned Features

These are not implemented yet or are planned for later.

- Blood donation news
- Meet Our Doctors
- Emergency popup
- Improved donor matching
- Real-time donor availability
- Real blood inventory
- Login/signup backend
- User profiles
- Notifications
- Verified hospitals
- Verified blood banks
- Backend API
- Database

---

# 27. Important Development Rules

### Keep the current UI structure consistent

Do not redesign individual pages independently.

ResQ uses a common:

```text
Sidebar
+
Topbar
+
Page content
```

structure.

### Reuse existing CSS classes

Before creating a new class, check `style.css`.

### Keep feature logic separated

```text
app.js
→ global UI

donor.js
→ donor registration

find-blood.js
→ donor search

hospitals.js
→ map

emergency.js
→ emergency flow

eligibility.js
→ eligibility

compatibility.js
→ compatibility

dashboard.js
→ dashboard
```

### Test connected pages after changing localStorage

Changing donor or emergency storage affects multiple pages.

For example:

```text
donor.js
      ↓
resqDonors
      ↓
find-blood.js
      ↓
dashboard.js
```

---

# 28. Testing Checklist

Before pushing changes, test:

### Emergency

- Select every blood group
- Continue without selection
- Go back
- Submit invalid patient data
- Submit invalid phone number
- Submit valid request
- Check localStorage
- Check dashboard

### Donor

- Invalid name
- Invalid phone
- Invalid age
- Missing blood group
- Valid registration
- Search newly registered donor

### Map

- Search Ambala
- Search Chandigarh
- Search Delhi
- Search another Indian city
- Hospital filter
- Blood-bank filter
- Marker popup
- Directions link

### Dashboard

- Donor count
- Available donor count
- Request count
- Critical request count
- Recent donors
- Recent requests

---

# 29. Production Architecture Later

When the project moves beyond the prototype, the architecture should become:

```text
                    ResQ Frontend
                          │
                          ▼
                     Backend API
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
       Database      Authentication    Notifications
          │
          ▼
   Donor / Request Data
          │
          ▼
   Matching Engine
          │
          ▼
  Emergency Blood Support
```

External services can remain responsible for location information:

```text
ResQ Backend
      │
      ├── Nominatim
      │
      ├── Overpass
      │
      └── Official blood-stock sources
```

---

# 30. What NOT To Assume

The current project does not yet have:

- Real authentication
- Real user accounts
- A backend
- A production database
- Guaranteed blood availability
- Verified medical facility data
- Real-time donor notifications
- Production-grade medical decision support

These are future development areas.

---

# 31. Project Goal

The goal of ResQ is to reduce the friction between:

```text
"I need blood"
```

and:

```text
"I found where I can get blood support."
```

The application should make the emergency path fast, clear, and easy to understand while keeping normal donor and medical-resource features available for non-emergency users.
