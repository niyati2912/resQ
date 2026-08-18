const donorForm =
    document.getElementById(
        "donorForm"
    );


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


function showError(
    elementId,
    message
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            message;

    }

}


function clearErrors() {

    document
        .querySelectorAll(
            ".error-message"
        )
        .forEach(
            error => {

                error.textContent =
                    "";

            }
        );

}


if (donorForm) {

    donorForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearErrors();


            const name =
                document
                    .getElementById(
                        "donorName"
                    )
                    .value
                    .trim();


            const bloodGroup =
                document
                    .getElementById(
                        "bloodGroup"
                    )
                    .value;


            const phone =
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();


            const city =
                document
                    .getElementById(
                        "city"
                    )
                    .value
                    .trim();


            const age =
                Number(
                    document
                        .getElementById(
                            "age"
                        )
                        .value
                );


            const availability =
                document
                    .getElementById(
                        "availability"
                    )
                    .value;


            let isValid =
                true;


            if (
                name.length < 3
            ) {

                showError(
                    "nameError",
                    "Enter a valid name."
                );

                isValid =
                    false;

            }


            if (
                !bloodGroup
            ) {

                showError(
                    "bloodError",
                    "Please select a blood group."
                );

                isValid =
                    false;

            }


            if (
                !/^[0-9]{10}$/.test(
                    phone
                )
            ) {

                showError(
                    "phoneError",
                    "Enter a valid 10-digit phone number."
                );

                isValid =
                    false;

            }


            if (
                city.length < 2
            ) {

                showError(
                    "cityError",
                    "Enter a valid city."
                );

                isValid =
                    false;

            }


            if (
                !age ||
                age < 18 ||
                age > 65
            ) {

                showError(
                    "ageError",
                    "Age must be between 18 and 65."
                );

                isValid =
                    false;

            }


            if (
                !availability
            ) {

                showError(
                    "availabilityError",
                    "Please select availability."
                );

                isValid =
                    false;

            }


            if (!isValid) {
                return;
            }


            const donors =
                getStorageData(
                    "resqDonors"
                );


            const existingDonor =
                donors.find(
                    donor =>
                        donor.phone ===
                        phone
                );


            const donorData = {

                id:
                    existingDonor
                        ? existingDonor.id
                        : Date.now(),

                name,

                bloodGroup,

                phone,

                city,

                age,

                availability,

                createdAt:
                    existingDonor
                        ? existingDonor.createdAt
                        : new Date()
                            .toISOString()

            };


            if (existingDonor) {

                const donorIndex =
                    donors.findIndex(
                        donor =>
                            donor.phone ===
                            phone
                    );


                donors[donorIndex] =
                    donorData;

            } else {

                donors.push(
                    donorData
                );

            }


            saveStorageData(
                "resqDonors",
                donors
            );


            const successMessage =
                document.getElementById(
                    "successMessage"
                );


            if (successMessage) {

                successMessage.textContent =
                    existingDonor
                        ? "Your donor information has been updated."
                        : `Thank you ${name}! You are now registered as a ResQ donor.`;

            }


            donorForm.reset();

        }
    );

}