const bloodSearchForm =
    document.getElementById("bloodSearchForm");

const searchBloodGroup =
    document.getElementById("searchBloodGroup");

const searchCity =
    document.getElementById("searchCity");

const donorResults =
    document.getElementById("donorResults");

const searchMessage =
    document.getElementById("searchMessage");

const contactModal =
    document.getElementById("contactModal");

const closeModal =
    document.getElementById("closeModal");

const modalDonorName =
    document.getElementById("modalDonorName");

const modalBloodGroup =
    document.getElementById("modalBloodGroup");

const modalCity =
    document.getElementById("modalCity");

const modalPhone =
    document.getElementById("modalPhone");

const callDonor =
    document.getElementById("callDonor");


const bloodCompatibility = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],

    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],

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

    "O+": ["O+", "O-"],
    "O-": ["O-"]
};


function getStorageData(key) {
    try {
        const data = localStorage.getItem(key);

        return data
            ? JSON.parse(data)
            : [];
    } catch (error) {
        console.error(
            `Unable to read ${key}:`,
            error
        );

        return [];
    }
}


function getAllDonors() {
    return getStorageData("resqDonors");
}


function isCompatibleDonor(
    recipientBloodGroup,
    donorBloodGroup
) {
    const compatibleGroups =
        bloodCompatibility[recipientBloodGroup] || [];

    return compatibleGroups.includes(
        donorBloodGroup
    );
}


function searchDonors(
    selectedBloodGroup,
    enteredCity
) {
    const normalizedCity =
        enteredCity
            .trim()
            .toLowerCase();

    const donors = getAllDonors();

    return donors.filter(donor => {
        const donorCity =
            (donor.city || "")
                .trim()
                .toLowerCase();

        const isAvailable =
            !donor.availability ||
            donor.availability === "Available";

        return (
            isCompatibleDonor(
                selectedBloodGroup,
                donor.bloodGroup
            ) &&
            donorCity.includes(normalizedCity) &&
            isAvailable
        );
    });
}


function clearResults() {
    if (donorResults) {
        donorResults.innerHTML = "";
    }
}


function displayDonors(
    donors,
    selectedBloodGroup,
    enteredCity
) {
    clearResults();

    if (!searchMessage) return;

    if (!donors.length) {
        searchMessage.textContent =
            `No compatible available donors found for ${selectedBloodGroup} in ${enteredCity}.`;

        searchMessage.className =
            "search-error";

        return;
    }

    searchMessage.textContent =
        `${donors.length} compatible donor(s) found for ${selectedBloodGroup} in ${enteredCity}.`;

    searchMessage.className =
        "search-success";


    donors.forEach(donor => {
        const donorCard =
            document.createElement("article");

        donorCard.className =
            "donor-card";


        donorCard.innerHTML = `
            <div class="donor-card-top">
                <div class="donor-avatar">
                    🩸
                </div>

                <div>
                    <h2>${donor.name || "Donor"}</h2>

                    <p>
                        📍 ${donor.city || "City not listed"}
                    </p>
                </div>

                <span class="blood-group-tag">
                    ${donor.bloodGroup || "N/A"}
                </span>
            </div>

            <div class="donor-card-info">
                <p>
                    📞 ${donor.phone || "Phone not listed"}
                </p>

                <p>
                    🟢 ${
                        donor.availability || "Available"
                    }
                </p>
            </div>

            <button
                type="button"
                class="contact-donor-btn"
            >
                Contact Donor
            </button>
        `;


        const contactButton =
            donorCard.querySelector(
                ".contact-donor-btn"
            );

        contactButton.addEventListener(
            "click",
            () => {
                openContactModal(donor);
            }
        );

        donorResults?.appendChild(
            donorCard
        );
    });
}


function openContactModal(donor) {
    if (!contactModal) return;

    if (modalDonorName) {
        modalDonorName.textContent =
            donor.name || "Donor";
    }

    if (modalBloodGroup) {
        modalBloodGroup.textContent =
            donor.bloodGroup || "N/A";
    }

    if (modalCity) {
        modalCity.textContent =
            donor.city || "Not listed";
    }

    if (modalPhone) {
        modalPhone.textContent =
            donor.phone || "Not listed";
    }

    if (callDonor) {
        const phone =
            String(donor.phone || "")
                .replace(/[^\d+]/g, "");

        callDonor.href =
            phone
                ? `tel:${phone}`
                : "#";
    }

    contactModal.classList.add("show");
}


function closeContactModal() {
    contactModal?.classList.remove(
        "show"
    );
}


function performSearch() {
    const selectedBloodGroup =
        searchBloodGroup?.value;

    const enteredCity =
        searchCity?.value.trim();

    if (!selectedBloodGroup || !enteredCity) {
        if (searchMessage) {
            searchMessage.textContent =
                "Please select a blood group and enter a city.";

            searchMessage.className =
                "search-error";
        }

        clearResults();

        return;
    }

    const matchingDonors =
        searchDonors(
            selectedBloodGroup,
            enteredCity
        );

    displayDonors(
        matchingDonors,
        selectedBloodGroup,
        enteredCity
    );
}


if (bloodSearchForm) {
    bloodSearchForm.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            performSearch();
        }
    );
}


if (closeModal) {
    closeModal.addEventListener(
        "click",
        closeContactModal
    );
}


if (contactModal) {
    contactModal.addEventListener(
        "click",
        event => {
            if (event.target === contactModal) {
                closeContactModal();
            }
        }
    );
}


document.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            closeContactModal();
        }
    }
);

function loadEmergencySearch() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const blood =
        params.get("blood");

    const city =
        params.get("city");

    const isEmergency =
        params.get("emergency") === "true";


    if (
        !blood ||
        !city ||
        !searchBloodGroup ||
        !searchCity
    ) {
        return;
    }


    searchBloodGroup.value =
        blood;

    searchCity.value =
        city;


    const matchingDonors =
        searchDonors(
            blood,
            city
        );


    displayDonors(
        matchingDonors,
        blood,
        city
    );


    if (isEmergency && searchMessage) {

        if (matchingDonors.length > 0) {

            searchMessage.textContent =
                `Emergency search: ${matchingDonors.length} compatible available donor(s) found for ${blood} in ${city}.`;

            searchMessage.className =
                "search-success";

        } else {

            searchMessage.textContent =
                `Emergency search: no compatible available donors were found for ${blood} in ${city}.`;

            searchMessage.className =
                "search-error";

        }

    }

}


loadEmergencySearch();