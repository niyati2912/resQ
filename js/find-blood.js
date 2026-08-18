const bloodSearchForm =
    document.getElementById(
        "bloodSearchForm"
    );

const searchBloodGroup =
    document.getElementById(
        "searchBloodGroup"
    );

const searchCity =
    document.getElementById(
        "searchCity"
    );

const donorResults =
    document.getElementById(
        "donorResults"
    );

const searchMessage =
    document.getElementById(
        "searchMessage"
    );

const contactModal =
    document.getElementById(
        "contactModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const modalDonorName =
    document.getElementById(
        "modalDonorName"
    );

const modalBloodGroup =
    document.getElementById(
        "modalBloodGroup"
    );

const modalCity =
    document.getElementById(
        "modalCity"
    );

const modalPhone =
    document.getElementById(
        "modalPhone"
    );

const callDonor =
    document.getElementById(
        "callDonor"
    );


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


function getStorageData(key) {

    try {

        const data =
            localStorage.getItem(key);

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

    return getStorageData(
        "resqDonors"
    );

}


function isCompatibleDonor(
    recipientBloodGroup,
    donorBloodGroup
) {

    const compatibleGroups =
        bloodCompatibility[
            recipientBloodGroup
        ] || [];


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


    const donors =
        getAllDonors();


    return donors.filter(
        donor => {

            const donorCity =
                (donor.city || "")
                    .toLowerCase();


            return (

                isCompatibleDonor(
                    selectedBloodGroup,
                    donor.bloodGroup
                )

                &&

                donorCity.includes(
                    normalizedCity
                )

                &&

                donor.availability ===
                "Available"

            );

        }
    );

}


function clearResults() {

    donorResults.innerHTML = "";

}


function displayDonors(
    donors,
    selectedBloodGroup,
    enteredCity
) {

    clearResults();


    if (
        donors.length === 0
    ) {

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


    donors.forEach(
        donor => {

            const donorCard =
                document.createElement(
                    "article"
                );


            donorCard.className =
                "donor-card";


            const top =
                document.createElement(
                    "div"
                );

            top.className =
                "donor-card-top";


            const avatar =
                document.createElement(
                    "div"
                );

            avatar.className =
                "donor-avatar";

            avatar.textContent =
                "🩸";


            const details =
                document.createElement(
                    "div"
                );


            const name =
                document.createElement(
                    "h2"
                );

            name.textContent =
                donor.name;


            const city =
                document.createElement(
                    "p"
                );

            city.textContent =
                `📍 ${donor.city}`;


            details.appendChild(name);
            details.appendChild(city);


            const bloodTag =
                document.createElement(
                    "span"
                );

            bloodTag.className =
                "blood-group-tag";

            bloodTag.textContent =
                donor.bloodGroup;


            top.appendChild(avatar);
            top.appendChild(details);
            top.appendChild(bloodTag);


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "donor-card-info";


            const phone =
                document.createElement(
                    "p"
                );

            phone.textContent =
                `📞 ${donor.phone}`;


            const availability =
                document.createElement(
                    "p"
                );

            availability.textContent =
                `🟢 ${donor.availability}`;


            info.appendChild(phone);
            info.appendChild(availability);


            const contactButton =
                document.createElement(
                    "button"
                );

            contactButton.type =
                "button";

            contactButton.className =
                "contact-donor-btn";

            contactButton.textContent =
                "Contact Donor";


            contactButton.addEventListener(
                "click",
                function () {

                    openContactModal(
                        donor
                    );

                }
            );


            donorCard.appendChild(top);
            donorCard.appendChild(info);
            donorCard.appendChild(
                contactButton
            );


            donorResults.appendChild(
                donorCard
            );

        }
    );

}


function openContactModal(
    donor
) {

    if (
        !contactModal
    ) {
        return;
    }


    modalDonorName.textContent =
        donor.name;

    modalBloodGroup.textContent =
        donor.bloodGroup;

    modalCity.textContent =
        donor.city;

    modalPhone.textContent =
        donor.phone;


    callDonor.href =
        `tel:${donor.phone}`;


    contactModal.classList.add(
        "show-modal"
    );

}


function performSearch() {

    const selectedBloodGroup =
        searchBloodGroup.value;


    const enteredCity =
        searchCity.value.trim();


    if (
        !selectedBloodGroup ||
        !enteredCity
    ) {

        searchMessage.textContent =
            "Please select a blood group and enter a city.";

        searchMessage.className =
            "search-error";

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
        function (event) {

            event.preventDefault();

            performSearch();

        }
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        function () {

            contactModal.classList.remove(
                "show-modal"
            );

        }
    );

}


if (contactModal) {

    contactModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                contactModal
            ) {

                contactModal.classList.remove(
                    "show-modal"
                );

            }

        }
    );

}


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
        params.get("emergency") ===
        "true";


    if (
        !blood ||
        !city
    ) {
        return;
    }


    searchBloodGroup.value =
        blood;

    searchCity.value =
        city;


    performSearch();


    if (isEmergency) {

        searchMessage.textContent =
            `Emergency search: compatible donors for ${blood} in ${city}.`;

        searchMessage.className =
            "search-success";

    }

}


loadEmergencySearch();