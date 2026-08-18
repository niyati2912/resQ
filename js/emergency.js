const bloodButtons = document.querySelectorAll("[data-blood]");

const nextBtn = document.querySelector("[data-next]");
const backBtn = document.querySelector("[data-back]");

const steps = document.querySelectorAll(".emergency-step");

const emergencyForm = document.getElementById("emergencyForm");

const patientName = document.getElementById("patientName");
const requestCity = document.getElementById("requestCity");
const hospital = document.getElementById("hospital");
const contactNumber = document.getElementById("contactNumber");
const bloodUnits = document.getElementById("bloodUnits");
const urgency = document.getElementById("urgency");

const selectedBlood = document.getElementById("selectedBlood");

const emergencyError = document.getElementById("emergencyError");
const emergencyMessage = document.getElementById("emergencyMessage");


let selectedBloodGroup = "";


/* =========================================
   SHOW ERROR MESSAGE
========================================= */

function showError(message) {
    if (!emergencyError) return;

    emergencyError.textContent = message;
}


function clearError() {
    if (!emergencyError) return;

    emergencyError.textContent = "";
}


/* =========================================
   SHOW SUCCESS MESSAGE
========================================= */

function showSuccess(message) {
    if (!emergencyMessage) return;

    emergencyMessage.textContent = message;
}


function clearSuccess() {
    if (!emergencyMessage) return;

    emergencyMessage.textContent = "";
}


/* =========================================
   CHANGE STEP
========================================= */

function showStep(stepNumber) {

    steps.forEach((step, index) => {

        if (index === stepNumber) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }

    });

}


/* =========================================
   SELECT BLOOD GROUP
========================================= */

bloodButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedBloodGroup = button.dataset.blood;


        bloodButtons.forEach(btn => {
            btn.classList.remove("selected");
        });


        button.classList.add("selected");


        if (selectedBlood) {
            selectedBlood.textContent = selectedBloodGroup;
        }


        clearError();

    });

});


/* =========================================
   CONTINUE TO STEP 2
========================================= */

if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        if (!selectedBloodGroup) {

            showError(
                "Please select the required blood group."
            );

            return;
        }


        clearError();

        showStep(1);

    });

}


/* =========================================
   GO BACK TO STEP 1
========================================= */

if (backBtn) {

    backBtn.addEventListener("click", () => {

        clearError();
        clearSuccess();

        showStep(0);

    });

}


/* =========================================
   GET EXISTING EMERGENCY REQUESTS
========================================= */

function getEmergencyRequests() {

    try {

        const storedRequests =
            localStorage.getItem(
                "resqEmergencyRequests"
            );


        if (!storedRequests) {
            return [];
        }


        return JSON.parse(
            storedRequests
        );

    } catch (error) {

        console.error(
            "Error reading emergency requests:",
            error
        );

        return [];

    }

}


/* =========================================
   CREATE EMERGENCY REQUEST
========================================= */

function createEmergencyRequest() {

    const name =
        patientName.value.trim();

    const city =
        requestCity.value.trim();

    const hospitalName =
        hospital.value.trim();

    const contact =
        contactNumber.value
            .trim()
            .replace(/\s/g, "");

    const units =
        Number(bloodUnits.value);

    const urgencyLevel =
        urgency.value;


    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (!selectedBloodGroup) {

        showError(
            "Please select a blood group."
        );

        showStep(0);

        return null;

    }


    if (!name || name.length < 2) {

        showError(
            "Please enter a valid patient name."
        );

        return null;

    }


    if (!city) {

        showError(
            "Please enter the city."
        );

        return null;

    }


    if (!hospitalName) {

        showError(
            "Please enter the hospital name."
        );

        return null;

    }


    if (!/^\d{10}$/.test(contact)) {

        showError(
            "Please enter a valid 10-digit contact number."
        );

        return null;

    }


    if (!units || units < 1) {

        showError(
            "Please enter at least 1 blood unit."
        );

        return null;

    }


    if (!urgencyLevel) {

        showError(
            "Please select the urgency level."
        );

        return null;

    }


    /* -----------------------------
       RETURN REQUEST OBJECT
    ----------------------------- */

    return {

        id:
            Date.now().toString(),

        patientName:
            name,

        bloodGroup:
            selectedBloodGroup,

        city:
            city,

        hospital:
            hospitalName,

        contact:
            contact,

        units:
            units,

        urgency:
            urgencyLevel,

        status:
            "Open",

        createdAt:
            new Date().toISOString()

    };

}


/* =========================================
   SUBMIT EMERGENCY REQUEST
========================================= */

if (emergencyForm) {

    emergencyForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            clearError();
            clearSuccess();


            const request =
                createEmergencyRequest();


            if (!request) {
                return;
            }


            const requests =
                getEmergencyRequests();


            requests.unshift(
                request
            );


            localStorage.setItem(
                "resqEmergencyRequests",
                JSON.stringify(requests)
            );


            showSuccess(
                "Emergency request created. Searching for compatible donors..."
            );


            const params =
                new URLSearchParams({
                    blood: request.bloodGroup,
                    city: request.city,
                    emergency: "true"
                });


            setTimeout(() => {

                window.location.href =
                    `find-blood.html?${params.toString()}`;

            }, 800);

        }
    );

}


/* =========================================
   INITIAL STATE
========================================= */

showStep(0);