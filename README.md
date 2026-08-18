ResQ

<p align="center">
  <strong>Emergency Blood Support & Donor Discovery Platform</strong>
</p>

<p align="center">
  A frontend-first web application that helps users register as blood donors, search compatible donors, create emergency blood requests, check basic donation eligibility, and locate medical facilities.
</p>

────────

Table of Contents

* Problem Statement
* Solution
* Core Features
* Application Architecture
* Application Flow
* Data Model and Storage
* Blood Compatibility Logic
* Technology Stack
* Project Structure
* How to Run
* Limitations
* Future Improvements
* Viva Quick Revision

────────

Problem Statement

During a blood emergency, a person may need to perform several separate tasks:

1. Find a compatible donor.
2. Check whether a donor is currently available.
3. Locate nearby hospitals or blood banks.
4. Contact the relevant person or facility.
5. Understand basic blood compatibility.

ResQ brings these workflows into a single web application and demonstrates how a simple information system can reduce the number of steps required to start an emergency blood search.

────────

Solution

ResQ is a multi-page frontend application built with HTML, CSS, and JavaScript.

The current prototype uses browser localStorage for persistence. This allows donor records, user accounts, and emergency requests to remain available after page refreshes on the same browser.

The application includes:

* User signup and login
* Local session tracking
* Account/profile management
* Donor registration
* Compatible donor search
* Emergency blood request workflow
* Blood compatibility checker
* Basic donation eligibility checker
* Dashboard statistics
* Hospital and blood-bank discovery interface
* Light/dark theme
* Responsive sidebar navigation

────────

Core Features

1. User Authentication Prototype

Users can create an account using:

* Name
* Email
* Phone number
* City
* Blood group
* Role
* Password

The account is stored in:

text
resqUsers


The currently logged-in user is stored separately in:

text
resqCurrentUser


This allows the interface to remember the current user and display account-specific information.

> Important: This is prototype authentication using browser storage. Passwords are not production-secure and a real application would use a backend, password hashing, and secure session/token management.

────────

2. Account Management

After login, the user can access an account page to:

* View profile information
* Edit name
* Edit email
* Edit phone number
* Edit city
* Edit blood group
* Change role
* Change password

When a user’s donor-related information changes, the application synchronizes the corresponding donor record.

────────

3. Blood Donor Registration

A donor can register with:

* Name
* Blood group
* Phone number
* City
* Age
* Availability

The application validates important fields before saving the donor.

Donor records are stored in:

text
resqDonors


Basic validation includes:

* Name validation
* Blood-group selection
* 10-digit phone validation
* City validation
* Age range validation
* Availability selection

────────

4. Find Compatible Donors

Users search using:

* Required recipient blood group
* City

The search does not simply look for an identical blood group. It uses a compatibility mapping to determine whether a donor group can donate to the selected recipient group.

The results are filtered by:

text
Compatible blood group
AND
Matching city
AND
Availability = Available


The user can then open donor contact information.

────────

5. Emergency Blood Request

The emergency workflow is designed to be shorter and more direct.

Flow:

text
Select Required Blood Group
        ↓
Enter Patient and Hospital Details
        ↓
Validate Information
        ↓
Save Emergency Request
        ↓
Redirect to Compatible Donor Search


Each emergency request contains:

text
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


Requests are stored under:

text
resqEmergencyRequests


The emergency request is then passed to the donor search page using URL query parameters.

Example concept:

text
find-blood.html?blood=O%2B&city=Delhi&emergency=true


The donor search page reads these parameters and automatically performs the search.

────────

6. Blood Compatibility Checker

The compatibility checker uses a JavaScript object that maps each recipient blood group to the donor blood groups accepted by that recipient.

Example:

javascript
"O-": ["O-"]

"A-": ["A-", "O-"]

"AB+": [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
]


The application checks whether the selected donor group exists in the compatible list for the recipient.

Conceptually:

text
recipient
   ↓
Find allowed donor groups
   ↓
Check whether selected donor is included
   ↓
Compatible / Not Compatible


This feature is for educational demonstration and does not replace clinical blood-bank verification.

────────

7. Donation Eligibility Checker

The eligibility checker performs a basic screening based on:

* Age
* Weight
* Previous donation timing
* Self-reported health status

The current project checks:

text
Age: 18–65
Weight: at least 50 kg
Donation period: eligible/never
Health status: healthy


The output explains whether the user passes the application’s basic screening criteria.

This is not a medical diagnosis or official donor eligibility decision.

────────

8. Dashboard

The dashboard reads locally stored application data and calculates:

* Total donors
* Available donors
* Total emergency requests
* Critical emergency requests
* Recent donors
* Recent emergency requests

The dashboard is generated dynamically from localStorage.

────────

9. Hospital and Blood-Bank Discovery

The hospital page is designed around public mapping services rather than a paid Google Maps API.

The intended data flow is:

text
User enters city
        ↓
Geocode city
        ↓
Get latitude and longitude
        ↓
Query mapped medical facilities
        ↓
Display facilities on interactive map


The project uses:

* Leaflet.js
* OpenStreetMap
* Nominatim
* Overpass API

The application distinguishes between medical facilities such as:

* Hospitals
* Clinics
* Blood banks
* Blood centres

Facility locations do not represent guaranteed real-time blood inventory.

────────

Application Architecture

ResQ follows a simple frontend architecture:

text
HTML
  ↓
Page structure and forms

CSS
  ↓
Shared visual design and responsive layout

JavaScript
  ↓
Page behaviour, validation, storage and application logic

localStorage
  ↓
Persistent browser-side prototype data


Shared Logic

js/app.js is responsible for global interface behaviour such as:

* Sidebar behaviour
* Theme switching
* Language selection logic
* Account button behaviour
* Current-user detection
* Logout
* Navigation state

Feature-specific logic is kept in separate JavaScript files.

────────

Application Flow

Standard User Flow

text
Home
 │
 ├── Sign Up / Login
 │       ↓
 │     Dashboard
 │       ↓
 │     Account Management
 │
 ├── Become a Donor
 │       ↓
 │     Save Donor Record
 │
 ├── Find Blood
 │       ↓
 │     Search Compatible Available Donors
 │
 ├── Eligibility
 │       ↓
 │     Basic Screening Result
 │
 ├── Compatibility
 │       ↓
 │     Compatible / Not Compatible
 │
 └── Emergency
         ↓
      Create Emergency Request
         ↓
      Redirect to Donor Search


Data Flow

text
Signup
   ↓
resqUsers
   ↓
resqCurrentUser

Donor Registration
   ↓
resqDonors
   ↓
Find Blood + Dashboard

Emergency Request
   ↓
resqEmergencyRequests
   ↓
Dashboard + Emergency Donor Search


────────

Data Model and Storage

Users

Storage key:

text
resqUsers


Typical structure:

javascript
{
    id,
    name,
    email,
    password,
    phone,
    city,
    bloodGroup,
    role,
    available
}


Current User

Storage key:

text
resqCurrentUser


This stores the currently active user’s profile information.

Donors

Storage key:

text
resqDonors


Typical donor structure:

javascript
{
    id,
    name,
    bloodGroup,
    phone,
    city,
    age,
    availability,
    createdAt
}


Emergency Requests

Storage key:

text
resqEmergencyRequests


Typical structure:

javascript
{
    id,
    patientName,
    bloodGroup,
    city,
    hospital,
    contact,
    units,
    urgency,
    status,
    createdAt
}


────────

Technology Stack

|Area             |Technology            |
|-----------------|----------------------|
|Structure        |HTML5                 |
|Styling          |CSS3                  |
|Application Logic|Vanilla JavaScript    |
|Icons            |Lucide                |
|Maps             |Leaflet.js            |
|Map Data         |OpenStreetMap         |
|Geocoding        |Nominatim             |
|Facility Search  |Overpass API          |
|Persistence      |Browser localStorage|
|Fonts            |Google Fonts          |

Why Vanilla JavaScript?

This project does not require a framework for its current scope. Vanilla JavaScript keeps the project:

* Easy to run
* Dependency-light
* Suitable for a static frontend prototype
* Simple to demonstrate during a viva

For a larger production application, the frontend could be migrated to React or another component-based framework.

────────

Project Structure

text
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
│   ├── account.js
│   ├── auth.js
│   ├── compatibility.js
│   ├── dashboard.js
│   ├── donor.js
│   ├── eligibility.js
│   ├── emergency.js
│   ├── find-blood.js
│   └── hospitals.js
│
├── documents/
│   └── project_analysis.md
│
├── account.html
├── compatibility.html
├── dashboard.html
├── donor.html
├── eligibility.html
├── emergency.html
├── find-blood.html
├── hospitals.html
├── index.html
├── login.html
├── resources.html
├── signup.html
└── README.md


────────

Page Responsibilities

|Page                |Purpose                                 |
|--------------------|----------------------------------------|
|index.html        |Landing page and application entry point|
|signup.html       |User account creation                   |
|login.html        |User login                              |
|account.html      |View and edit user profile and password |
|donor.html        |Donor registration                      |
|find-blood.html   |Compatible donor search                 |
|emergency.html    |Emergency blood request                 |
|dashboard.html    |Local data overview                     |
|eligibility.html  |Basic donation screening                |
|compatibility.html|Blood compatibility check               |
|hospitals.html    |Medical facility discovery              |
|resources.html    |Educational resources                   |

────────

JavaScript Responsibilities

|File              |Responsibility                                             |
|------------------|-----------------------------------------------------------|
|app.js          |Shared navigation, theme, account and UI logic             |
|auth.js         |Signup, login and current-user storage                     |
|account.js      |Profile updates, password changes and donor synchronization|
|donor.js        |Donor registration and validation                          |
|find-blood.js   |Compatible donor filtering and donor contact flow          |
|emergency.js    |Emergency request workflow and redirect                    |
|dashboard.js    |Dashboard statistics and recent records                    |
|eligibility.js  |Basic eligibility rules                                    |
|compatibility.js|Blood compatibility rules                                  |
|hospitals.js    |Hospital/blood-bank discovery and map behaviour            |

────────

How to Run

1. Clone the repository

bash
git clone <repository-url>


2. Open the project

bash
cd ResQ


Open the folder in VS Code.

3. Run using a local server

Use the Live Server extension in VS Code.

For example:

text
Right-click index.html
        ↓
Open with Live Server


Using a local server is recommended because external APIs and browser features can behave differently when files are opened directly with file://.

────────

Important Prototype Limitations

ResQ is a frontend prototype, not a production medical system.

1. No Backend Database

Data is stored only in the browser’s localStorage.

This means:

* Data is browser-specific.
* Data is not shared between users/devices.
* Clearing browser storage removes the prototype data.

2. Authentication Is Demonstrational

The project currently does not provide:

* Server-side authentication
* Password hashing
* JWT/session management
* Access control middleware
* Account recovery

A production version should use a secure backend and hashed passwords.

3. No Guaranteed Real-Time Blood Inventory

The project can locate medical facilities, but it does not know the current stock of each blood group.

Actual blood availability must be verified with an authorized blood bank or official service.

4. No Real-Time Donor Notifications

When an emergency request is created, matching donors are filtered and displayed, but the application does not send SMS, push notifications, WhatsApp messages, or emails.

5. Medical Features Are Educational

The compatibility and eligibility tools are simplified project features.

Actual medical decisions must be confirmed by qualified healthcare professionals and authorized blood banks.

────────

Future Improvements

Backend

* REST API
* Database
* User authentication
* Password hashing
* Role-based access control

Real-Time Features

* Donor notifications
* Emergency alerts
* Availability updates
* Live request status

Medical and Data Integration

* Verified blood-bank data
* Official blood inventory integration
* Hospital verification
* Better donor eligibility logic

User Experience

* More complete multilingual support
* Location detection
* Better mobile workflows
* Request tracking
* Donor availability toggle

────────

Viva Quick Revision

What is ResQ?

ResQ is a frontend-first emergency blood support and donor discovery platform. It combines donor registration, compatible donor search, emergency requests, blood compatibility, basic eligibility screening, account management, and dashboard monitoring.

────────

Why did we build it?

The idea is to reduce the number of separate steps a person performs when searching for blood support during an emergency.

Instead of using unrelated pages or services for donors, compatibility, requests, and facilities, ResQ provides a single workflow.

────────

What is the architecture?

It is a multi-page frontend application.

text
HTML + CSS + JavaScript
          ↓
      localStorage


External mapping services are used for medical facility discovery.

────────

Why localStorage?

Because this version is a frontend prototype and does not have a backend database.

It provides:

* Persistence after refresh
* No server setup
* Easy demonstration

But it is not suitable for production because the data is local to one browser and is not secure.

────────

How does login work?

During signup, a user object is saved in resqUsers.

During login, the entered email and password are checked against stored users.

The selected user is then saved as resqCurrentUser, which acts as the prototype’s current session.

────────

How does donor search work?

The user enters:

* Required recipient blood group
* City

The application filters the donor list using:

text
Blood compatibility
AND
City match
AND
Available status


────────

How does blood compatibility work?

A JavaScript mapping defines which donor groups are compatible with each recipient group.

The selected donor group is checked against the compatible donor list for the recipient.

────────

How does the emergency flow work?

text
Select blood group
        ↓
Enter emergency details
        ↓
Validate
        ↓
Store request
        ↓
Pass blood group and city through URL parameters
        ↓
Open Find Blood
        ↓
Automatically search compatible available donors


────────

How does the dashboard work?

The dashboard reads donor and emergency-request arrays from localStorage, then calculates counts using array operations such as:

* filter()
* slice()
* reverse()

It then dynamically creates recent donor and request rows.

────────

Why use Leaflet and OpenStreetMap?

They allow the project to demonstrate an interactive map without requiring a paid Google Maps API key.

The intended workflow uses geocoding to convert a city into coordinates and then queries mapped medical facilities around that location.

────────

What would you change for production?

The first major change would be moving from browser storage to:

text
Frontend
    ↓
Secure Backend API
    ↓
Database


I would also add:

* Hashed passwords
* Secure authentication
* Real donor verification
* Notifications
* Verified hospital data
* Official blood inventory integration
* Proper access control

────────

Most Important Honest Statement

ResQ is currently a functional frontend prototype. Its core workflows demonstrate how donor information, emergency requests, compatibility logic, and browser-side persistence can be connected. It is not presented as a production-ready medical platform, and real medical decisions or blood availability must always be verified through authorized healthcare and blood-bank systems.