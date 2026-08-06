/* ========================================
   RESQ EMERGENCY BLOOD REQUEST
======================================== */

const emergencyForm =
document.getElementById("emergencyForm");

const patientName =
document.getElementById("patientName");

const requiredBlood =
document.getElementById("requiredBlood");

const hospital =
document.getElementById("hospital");

const requestCity =
document.getElementById("requestCity");

const contactNumber =
document.getElementById("contactNumber");

const bloodUnits =
document.getElementById("bloodUnits");

const urgency =
document.getElementById("urgency");

const emergencyMessage =
document.getElementById("emergencyMessage");

const emergencyList =
document.getElementById("emergencyList");


/* ========================================
   SHOW ERROR
======================================== */

function showError(
    errorId,
    message
) {

    document.getElementById(
        errorId
    ).textContent = message;

}


/* ========================================
   CLEAR ALL ERRORS
======================================== */

function clearErrors() {

    const errors =
    document.querySelectorAll(
        ".error-message"
    );

    errors.forEach(
        error => {

            error.textContent = "";

        }
    );

}


/* ========================================
   FORM SUBMIT
======================================== */

emergencyForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();

        clearErrors();

        emergencyMessage.textContent = "";

        let isValid = true;


        /* Patient Name */

        if (
            patientName.value
            .trim() === ""
        ) {

            showError(
                "patientError",
                "Please enter patient name."
            );

            isValid = false;

        }


        /* Blood Group */

        if (
            requiredBlood.value === ""
        ) {

            showError(
                "requiredBloodError",
                "Please select blood group."
            );

            isValid = false;

        }


        /* Hospital */

        if (
            hospital.value
            .trim() === ""
        ) {

            showError(
                "hospitalError",
                "Please enter hospital name."
            );

            isValid = false;

        }


        /* City */

        if (
            requestCity.value
            .trim() === ""
        ) {

            showError(
                "requestCityError",
                "Please enter city."
            );

            isValid = false;

        }


        /* Contact Number */

        const phone =

        contactNumber.value
        .trim();


        if (
            !/^[0-9]{10}$/
            .test(phone)
        ) {

            showError(
                "contactError",
                "Enter a valid 10-digit number."
            );

            isValid = false;

        }


        /* Blood Units */

        if (
            Number(
                bloodUnits.value
            ) < 1
        ) {

            showError(
                "unitsError",
                "Enter at least 1 unit."
            );

            isValid = false;

        }


        /* Emergency Level */

        if (
            urgency.value === ""
        ) {

            showError(
                "urgencyError",
                "Please select emergency level."
            );

            isValid = false;

        }


        /* Stop if invalid */

        if (
            !isValid
        ) {

            return;

        }


        /* ========================================
           CREATE REQUEST OBJECT
        ======================================== */

        const newRequest = {

            id:
            Date.now(),

            patientName:
            patientName.value.trim(),

            bloodGroup:
            requiredBlood.value,

            hospital:
            hospital.value.trim(),

            city:
            requestCity.value.trim(),

            contact:
            phone,

            units:
            bloodUnits.value,

            urgency:
            urgency.value,

            date:
            new Date()
            .toLocaleString()

        };


        /* ========================================
           GET OLD REQUESTS
        ======================================== */

        const requests =

        JSON.parse(

            localStorage.getItem(
                "resqEmergencyRequests"
            )

        ) || [];


        /* Add new request */

        requests.push(
            newRequest
        );


        /* Save in Local Storage */

        localStorage.setItem(

            "resqEmergencyRequests",

            JSON.stringify(
                requests
            )

        );


        /* Success Message */

        emergencyMessage.innerHTML =

        `✅ Emergency request submitted successfully!

        <br>

        Blood Group:
        <strong>
        ${newRequest.bloodGroup}
        </strong>

        <br>

        Emergency Level:
        <strong>
        ${newRequest.urgency}
        </strong>`;


        /* Reset form */

        emergencyForm.reset();


        /* Show requests */

        displayEmergencyRequests();

    }

);


/* ========================================
   DISPLAY REQUESTS
======================================== */

function displayEmergencyRequests() {

    const requests =

    JSON.parse(

        localStorage.getItem(
            "resqEmergencyRequests"
        )

    ) || [];


    emergencyList.innerHTML = "";


    requests
    .slice()
    .reverse()
    .forEach(

        request => {

            const requestCard =

            document.createElement(
                "div"
            );


            requestCard.className =

            "emergency-request-card";


            requestCard.innerHTML =

            `

            <h3>

            🚨
            ${request.patientName}

            </h3>


            <p>

            <strong>
            Blood Group:
            </strong>

            ${request.bloodGroup}

            </p>


            <p>

            <strong>
            Hospital:
            </strong>

            ${request.hospital}

            </p>


            <p>

            <strong>
            City:
            </strong>

            ${request.city}

            </p>


            <p>

            <strong>
            Units:
            </strong>

            ${request.units}

            </p>


            <p>

            <strong>
            Status:
            </strong>

            ${request.urgency}

            </p>

            `;


            emergencyList.appendChild(
                requestCard
            );

        }

    );

}


/* ========================================
   LOAD SAVED REQUESTS
======================================== */

displayEmergencyRequests();