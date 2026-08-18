const totalDonors =
    document.getElementById("totalDonors");

const availableDonors =
    document.getElementById("availableDonors");

const totalRequests =
    document.getElementById("totalRequests");

const criticalRequests =
    document.getElementById("criticalRequests");

const recentDonors =
    document.getElementById("recentDonors");

const recentRequests =
    document.getElementById("recentRequests");


/* =========================================
   STORAGE HELPER
========================================= */

function getStorageData(key) {
    try {
        const data =
            localStorage.getItem(key);

        const parsedData =
            data
                ? JSON.parse(data)
                : [];

        return Array.isArray(parsedData)
            ? parsedData
            : [];

    } catch (error) {

        console.error(
            `Unable to read data from ${key}:`,
            error
        );

        return [];
    }
}


/* =========================================
   EMPTY MESSAGE
========================================= */

function createEmptyMessage(message) {

    const paragraph =
        document.createElement("p");

    paragraph.className =
        "empty-data";

    paragraph.textContent =
        message;

    return paragraph;
}


/* =========================================
   SORT BY NEWEST
========================================= */

function getLatestItems(items, limit = 5) {

    return [...items]
        .sort((a, b) => {

            const dateA =
                new Date(
                    a.createdAt || 0
                ).getTime();

            const dateB =
                new Date(
                    b.createdAt || 0
                ).getTime();

            return dateB - dateA;

        })
        .slice(0, limit);
}


/* =========================================
   CREATE DONOR ROW
========================================= */

function createDonorRow(donor) {

    const row =
        document.createElement("div");

    row.className =
        "dashboard-row";


    const details =
        document.createElement("div");


    const name =
        document.createElement("strong");

    name.textContent =
        donor.name ||
        "Unnamed donor";


    const city =
        document.createElement("span");

    city.textContent =
        `📍 ${
            donor.city ||
            "City not provided"
        }`;


    details.appendChild(name);

    details.appendChild(city);


    const bloodTag =
        document.createElement("span");

    bloodTag.className =
        "blood-tag";

    bloodTag.textContent =
        donor.bloodGroup ||
        "N/A";


    row.appendChild(details);

    row.appendChild(bloodTag);


    return row;
}


/* =========================================
   CREATE EMERGENCY REQUEST ROW
========================================= */

function createRequestRow(request) {

    const row =
        document.createElement("div");

    row.className =
        "dashboard-row";


    const details =
        document.createElement("div");


    const patientName =
        document.createElement("strong");

    patientName.textContent =
        request.patientName ||
        "Unnamed patient";


    const hospital =
        document.createElement("span");

    hospital.textContent =
        `🏥 ${
            request.hospital ||
            "Hospital not provided"
        }`;


    details.appendChild(
        patientName
    );

    details.appendChild(
        hospital
    );


    const urgencyTag =
        document.createElement("span");

    urgencyTag.className =
        "urgency-tag";


    const urgency =
        request.urgency ||
        "Normal";

    urgencyTag.textContent =
        urgency;


    if (
        urgency.toLowerCase() ===
        "critical"
    ) {

        urgencyTag.classList.add(
            "critical"
        );

    }


    row.appendChild(details);

    row.appendChild(urgencyTag);


    return row;
}


/* =========================================
   LOAD DASHBOARD
========================================= */

function loadDashboard() {

    const donors =
        getStorageData(
            "resqDonors"
        );

    const requests =
        getStorageData(
            "resqEmergencyRequests"
        );


    /* -----------------------------
       CALCULATE STATS
    ----------------------------- */

    const available =
        donors.filter(
            donor =>
                donor.availability ===
                "Available"
        );


    const critical =
        requests.filter(
            request =>
                request.urgency ===
                "Critical"
        );


    /* -----------------------------
       UPDATE COUNTERS
    ----------------------------- */

    if (totalDonors) {

        totalDonors.textContent =
            donors.length;

    }


    if (availableDonors) {

        availableDonors.textContent =
            available.length;

    }


    if (totalRequests) {

        totalRequests.textContent =
            requests.length;

    }


    if (criticalRequests) {

        criticalRequests.textContent =
            critical.length;

    }


    /* -----------------------------
       RECENT DONORS
    ----------------------------- */

    if (recentDonors) {

        recentDonors.innerHTML =
            "";


        if (donors.length === 0) {

            recentDonors.appendChild(
                createEmptyMessage(
                    "No donors registered yet."
                )
            );

        } else {

            const latestDonors =
                getLatestItems(
                    donors
                );


            latestDonors.forEach(
                donor => {

                    recentDonors.appendChild(
                        createDonorRow(
                            donor
                        )
                    );

                }
            );

        }

    }


    /* -----------------------------
       RECENT EMERGENCY REQUESTS
    ----------------------------- */

    if (recentRequests) {

        recentRequests.innerHTML =
            "";


        if (requests.length === 0) {

            recentRequests.appendChild(
                createEmptyMessage(
                    "No emergency requests yet."
                )
            );

        } else {

            const latestRequests =
                getLatestItems(
                    requests
                );


            latestRequests.forEach(
                request => {

                    recentRequests.appendChild(
                        createRequestRow(
                            request
                        )
                    );

                }
            );

        }

    }

}


/* =========================================
   INITIALIZE DASHBOARD
========================================= */

loadDashboard();