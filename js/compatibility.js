/* ========================================
   RESQ BLOOD COMPATIBILITY CHECKER
======================================== */


const compatibilityForm =

document.getElementById(
    "compatibilityForm"
);


const recipientBlood =

document.getElementById(
    "recipientBlood"
);


const donorBlood =

document.getElementById(
    "donorBlood"
);


const compatibilityResult =

document.getElementById(
    "compatibilityResult"
);


/* Donor compatibility data */

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


/* Form event */

compatibilityForm.addEventListener(

    "submit",

    function (event) {

        event.preventDefault();


        const recipient =

        recipientBlood.value;


        const donor =

        donorBlood.value;


        const compatibleDonors =

        bloodCompatibility[
            recipient
        ];


        const isCompatible =

        compatibleDonors.includes(
            donor
        );


        if (
            isCompatible
        ) {

            compatibilityResult.innerHTML = `

                <div class="result-success">

                    <h2>

                        ✅ Compatible Match

                    </h2>

                    <p>

                        ${donor} blood is compatible
                        with a ${recipient} recipient.

                    </p>

                </div>

            `;

        }

        else {

            compatibilityResult.innerHTML = `

                <div class="result-error">

                    <h2>

                        ❌ Not Compatible

                    </h2>

                    <p>

                        ${donor} blood is not compatible
                        with a ${recipient} recipient.

                    </p>

                </div>

            `;

        }

    }

);