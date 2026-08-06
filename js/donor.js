const donorForm =
    document.getElementById("donorForm");


donorForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("donorName")
                .value
                .trim();


        const bloodGroup =
            document
                .getElementById("bloodGroup")
                .value;


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const city =
            document
                .getElementById("city")
                .value
                .trim();


        const age =
            Number(
                document
                    .getElementById("age")
                    .value
            );


        const availability =
            document
                .getElementById("availability")
                .value;


        let isValid = true;


        // Clear old errors

        document
            .querySelectorAll(
                ".error-message"
            )
            .forEach(
                error => {

                    error.textContent = "";

                }
            );


        // Name validation

        if (name.length < 3) {

            document
                .getElementById("nameError")
                .textContent =
                "Enter a valid name.";

            isValid = false;

        }


        // Blood group validation

        if (bloodGroup === "") {

            document
                .getElementById("bloodError")
                .textContent =
                "Please select a blood group.";

            isValid = false;

        }


        // Phone validation

        if (
            !/^[0-9]{10}$/.test(
                phone
            )
        ) {

            document
                .getElementById("phoneError")
                .textContent =
                "Enter a valid 10-digit phone number.";

            isValid = false;

        }


        // City validation

        if (city.length < 2) {

            document
                .getElementById("cityError")
                .textContent =
                "Enter a valid city.";

            isValid = false;

        }


        // Age validation

        if (
            age < 18 ||
            age > 65
        ) {

            document
                .getElementById("ageError")
                .textContent =
                "Age must be between 18 and 65.";

            isValid = false;

        }


        // Availability validation

        if (availability === "") {

            document
                .getElementById(
                    "availabilityError"
                )
                .textContent =
                "Please select availability.";

            isValid = false;

        }


        if (!isValid) {

            return;

        }


        // Create donor object

        const donor = {

            id: Date.now(),

            name,

            bloodGroup,

            phone,

            city,

            age,

            availability

        };


        // Get old donors

        const donors = JSON.parse(
            localStorage.getItem(
                "resqDonors"
            )
        ) || [];


        // Add new donor

        donors.push(
            donor
        );


        // Save in LocalStorage

        localStorage.setItem(
            "resqDonors",
            JSON.stringify(
                donors
            )
        );


        // Success message

        const successMessage =
            document.getElementById(
                "successMessage"
            );


        successMessage.textContent =
            `Thank you ${name}! You are now registered as a ResQ donor. 🩸`;


        // Reset form

        donorForm.reset();

    }
);