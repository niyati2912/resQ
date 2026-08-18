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


function getStorageData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(
            `Unable to read data from ${key}:`,
            error
        );

        return [];
    }
}


function createEmptyMessage(message) {
    const paragraph =
        document.createElement("p");

    paragraph.className = "empty-data";
    paragraph.textContent = message;

    return paragraph;
}


function createDonorRow(donor) {
    const row =
        document.createElement("div");

    row.className = "dashboard-row";


    const details =
        document.createElement("div");


    const name =
        document.createElement("strong");

    name.textContent =
        donor.name || "Unnamed donor";


    const city =
        document.createElement("span");

    city.textContent =
        `📍 ${donor.city || "City not provided"}`;


    details.appendChild(name);
    details.appendChild(city);


    const bloodTag =
        document.createElement("span");

    bloodTag.className = "blood-tag";

    bloodTag.textContent =
        donor.bloodGroup || "N/A";


    row.appendChild(details);
    row.appendChild(bloodTag);

    return row;
}


function createRequestRow(request) {
    const row =
        document.createElement("div");

    row.className = "dashboard-row";


    const details =
        document.createElement("div");


    const patientName =
        document.createElement("strong");

    patientName.textContent =
        request.patientName || "Unnamed patient";


    const hospital =
        document.createElement("span");

    hospital.textContent =
        `🏥 ${request.hospital || "Hospital not provided"}`;


    details.appendChild(patientName);
    details.appendChild(hospital);


    const urgencyTag =
        document.createElement("span");

    urgencyTag.className = "urgency-tag";

    urgencyTag.textContent =
        request.urgency || "Normal";


    row.appendChild(details);
    row.appendChild(urgencyTag);

    return row;
}


function loadDashboard() {
    const donors =
        getStorageData("resqDonors");

    const requests =
        getStorageData(
            "resqEmergencyRequests"
        );


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


    if (recentDonors) {
        recentDonors.innerHTML = "";


        if (donors.length === 0) {
            recentDonors.appendChild(
                createEmptyMessage(
                    "No donors registered yet."
                )
            );
        } else {
            const latestDonors =
                donors
                    .slice(-5)
                    .reverse();

            latestDonors.forEach(
                donor => {
                    recentDonors.appendChild(
                        createDonorRow(donor)
                    );
                }
            );
        }
    }


    if (recentRequests) {
        recentRequests.innerHTML = "";


        if (requests.length === 0) {
            recentRequests.appendChild(
                createEmptyMessage(
                    "No emergency requests yet."
                )
            );
        } else {
            const latestRequests =
                requests
                    .slice(-5)
                    .reverse();

            latestRequests.forEach(
                request => {
                    recentRequests.appendChild(
                        createRequestRow(request)
                    );
                }
            );
        }
    }
}


loadDashboard();