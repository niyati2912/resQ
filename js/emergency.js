const emergencyForm = document.getElementById("emergencyForm");

const bloodOptions = document.querySelectorAll(".blood-option");

const emergencySteps = document.querySelectorAll(".emergency-step");

const selectedBlood = document.getElementById("selectedBlood");

const emergencyError = document.getElementById("emergencyError");

const emergencyMessage =
    document.getElementById("emergencyMessage");

let selectedBloodGroup = "";


bloodOptions.forEach(button => {

    button.addEventListener("click", function () {

        bloodOptions.forEach(option => {
            option.classList.remove("selected");
        });

        this.classList.add("selected");

        selectedBloodGroup =
            this.dataset.blood;

        selectedBlood.textContent =
            selectedBloodGroup;

        emergencyError.textContent = "";

    });

});


const nextButton =
    document.querySelector("[data-next]");


if (nextButton) {

    nextButton.addEventListener("click", function () {

        if (!selectedBloodGroup) {

            emergencyError.textContent =
                "Please select a blood group first.";

            return;
        }


        emergencyError.textContent = "";


        emergencySteps[0]
            .classList.remove("active");


        emergencySteps[1]
            .classList.add("active");


        selectedBlood.textContent =
            selectedBloodGroup;

    });

}


const backButton =
    document.querySelector("[data-back]");


if (backButton) {

    backButton.addEventListener("click", function () {

        emergencySteps[1]
            .classList.remove("active");


        emergencySteps[0]
            .classList.add("active");


        emergencyError.textContent =
            "";

        emergencyMessage.textContent =
            "";

    });

}


emergencyForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        emergencyError.textContent =
            "";

        emergencyMessage.textContent =
            "";


        if (!selectedBloodGroup) {

            emergencySteps[1]
                .classList.remove("active");

            emergencySteps[0]
                .classList.add("active");


            emergencyError.textContent =
                "Please select a blood group.";

            return;

        }


        const patientName =
            document.getElementById(
                "patientName"
            ).value.trim();


        const city =
            document.getElementById(
                "requestCity"
            ).value.trim();


        const hospital =
            document.getElementById(
                "hospital"
            ).value.trim();


        const contact =
            document.getElementById(
                "contactNumber"
            ).value.trim();


        const units =
            document.getElementById(
                "bloodUnits"
            ).value;


        const urgency =
            document.getElementById(
                "urgency"
            ).value;


        if (!patientName) {

            emergencyError.textContent =
                "Please enter the patient's name.";

            return;

        }


        if (!city) {

            emergencyError.textContent =
                "Please enter the city.";

            return;

        }


        if (!hospital) {

            emergencyError.textContent =
                "Please enter the hospital name.";

            return;

        }


        if (
            !/^[0-9]{10}$/.test(
                contact
            )
        ) {

            emergencyError.textContent =
                "Please enter a valid 10-digit contact number.";

            return;

        }


        if (
            !units ||
            Number(units) < 1
        ) {

            emergencyError.textContent =
                "Please enter the number of units required.";

            return;

        }


        if (!urgency) {

            emergencyError.textContent =
                "Please select the urgency level.";

            return;

        }


        const request = {

            id: Date.now(),

            patientName:
                patientName,

            bloodGroup:
                selectedBloodGroup,

            city:
                city,

            hospital:
                hospital,

            contact:
                contact,

            units:
                Number(units),

            urgency:
                urgency,

            status:
                "Active",

            createdAt:
                new Date().toISOString()

        };


        // --------------------------------
        // Save request
        // --------------------------------

        const existingRequests =
            JSON.parse(
                localStorage.getItem(
                    "resqEmergencyRequests"
                )
            ) || [];


        existingRequests.push(
            request
        );


        localStorage.setItem(
            "resqEmergencyRequests",
            JSON.stringify(
                existingRequests
            )
        );


        emergencyMessage.innerHTML =

            `Emergency request submitted successfully for 
            <strong>${selectedBloodGroup}</strong> blood. 
            Finding support near ${city}...`;


        setTimeout(() => {

            window.location.href =
                `hospitals.html?city=${encodeURIComponent(city)}`;

        }, 1800);

    }
);