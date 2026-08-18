const emergencyForm =
    document.getElementById(
        "emergencyForm"
    );

const bloodOptions =
    document.querySelectorAll(
        ".blood-option"
    );

const emergencySteps =
    document.querySelectorAll(
        ".emergency-step"
    );

const selectedBlood =
    document.getElementById(
        "selectedBlood"
    );

const emergencyError =
    document.getElementById(
        "emergencyError"
    );

const emergencyMessage =
    document.getElementById(
        "emergencyMessage"
    );


let selectedBloodGroup = "";


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


function saveStorageData(
    key,
    data
) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}


bloodOptions.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                bloodOptions.forEach(
                    option => {
                        option.classList.remove(
                            "selected"
                        );
                    }
                );


                this.classList.add(
                    "selected"
                );


                selectedBloodGroup =
                    this.dataset.blood;


                if (selectedBlood) {
                    selectedBlood.textContent =
                        selectedBloodGroup;
                }


                if (emergencyError) {
                    emergencyError.textContent =
                        "";
                }

            }
        );

    }
);


const nextButton =
    document.querySelector(
        "[data-next]"
    );


if (nextButton) {

    nextButton.addEventListener(
        "click",
        function () {

            if (!selectedBloodGroup) {

                emergencyError.textContent =
                    "Please select a blood group first.";

                return;
            }


            emergencyError.textContent =
                "";


            emergencySteps[0]
                .classList.remove(
                    "active"
                );


            emergencySteps[1]
                .classList.add(
                    "active"
                );


            selectedBlood.textContent =
                selectedBloodGroup;

        }
    );
}


const backButton =
    document.querySelector(
        "[data-back]"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            emergencySteps[1]
                .classList.remove(
                    "active"
                );


            emergencySteps[0]
                .classList.add(
                    "active"
                );


            emergencyError.textContent =
                "";

            emergencyMessage.textContent =
                "";

        }
    );
}


if (emergencyForm) {

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
                    .classList.remove(
                        "active"
                    );


                emergencySteps[0]
                    .classList.add(
                        "active"
                    );


                emergencyError.textContent =
                    "Please select a blood group.";

                return;
            }


            const patientName =
                document
                    .getElementById(
                        "patientName"
                    )
                    .value
                    .trim();


            const city =
                document
                    .getElementById(
                        "requestCity"
                    )
                    .value
                    .trim();


            const hospital =
                document
                    .getElementById(
                        "hospital"
                    )
                    .value
                    .trim();


            const contact =
                document
                    .getElementById(
                        "contactNumber"
                    )
                    .value
                    .trim();


            const units =
                document
                    .getElementById(
                        "bloodUnits"
                    )
                    .value;


            const urgency =
                document
                    .getElementById(
                        "urgency"
                    )
                    .value;


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
                    "Please enter at least one blood unit.";

                return;
            }


            if (!urgency) {

                emergencyError.textContent =
                    "Please select the urgency level.";

                return;
            }


            const request = {

                id:
                    Date.now(),

                patientName,

                bloodGroup:
                    selectedBloodGroup,

                city,

                hospital,

                contact,

                units:
                    Number(units),

                urgency,

                status:
                    "Active",

                createdAt:
                    new Date().toISOString()

            };


            const requests =
                getStorageData(
                    "resqEmergencyRequests"
                );


            requests.push(
                request
            );


            saveStorageData(
                "resqEmergencyRequests",
                requests
            );


            emergencyMessage.textContent =
                `Emergency request submitted successfully. Searching for compatible ${selectedBloodGroup} blood donors near ${city}...`;


            setTimeout(
                function () {

                    const params =
                        new URLSearchParams({

                            blood:
                                selectedBloodGroup,

                            city:
                                city,

                            emergency:
                                "true"

                        });


                    window.location.href =
                        `find-blood.html?${params.toString()}`;

                },
                1200
            );

        }
    );
}