/* ========================================
   RESQ ELIGIBILITY CHECKER
======================================== */

const eligibilityForm =
document.getElementById("eligibilityForm");

const ageInput =
document.getElementById("age");

const weightInput =
document.getElementById("weight");

const lastDonation =
document.getElementById("lastDonation");

const healthStatus =
document.getElementById("healthStatus");

const eligibilityResult =
document.getElementById("eligibilityResult");


/* Check if all elements exist */

if (
    eligibilityForm &&
    ageInput &&
    weightInput &&
    lastDonation &&
    healthStatus &&
    eligibilityResult
) {

    /* Form submit event */

    eligibilityForm.addEventListener(

        "submit",

        function (event) {

            /* Stop page refresh */

            event.preventDefault();


            /* Get user values */

            const age =
            Number(ageInput.value);

            const weight =
            Number(weightInput.value);

            const donationPeriod =
            lastDonation.value;

            const health =
            healthStatus.value;


            /* Eligibility conditions */

            const validAge =
            age >= 18 &&
            age <= 65;


            const validWeight =
            weight >= 50;


            const validDonationPeriod =

            donationPeriod === "never" ||

            donationPeriod === "eligible";


            const healthy =
            health === "healthy";


            /* Final result */

            if (

                validAge &&

                validWeight &&

                validDonationPeriod &&

                healthy

            ) {

                eligibilityResult.innerHTML = `

                    <div class="result-success">

                        <h2>
                            ✅ Basic Eligibility Passed
                        </h2>

                        <p>
                            Based on the details entered,
                            you meet the basic screening
                            conditions for this project.
                        </p>

                    </div>

                `;

            }

            else {

                let reasons = [];


                if (!validAge) {

                    reasons.push(

                        "Age must be between 18 and 65."

                    );

                }


                if (!validWeight) {

                    reasons.push(

                        "Weight must be at least 50 kg."

                    );

                }


                if (!validDonationPeriod) {

                    reasons.push(

                        "The selected donation period needs further review."

                    );

                }


                if (!healthy) {

                    reasons.push(

                        "Current health status requires professional assessment."

                    );

                }


                eligibilityResult.innerHTML = `

                    <div class="result-error">

                        <h2>
                            ⚠️ Basic Eligibility Not Passed
                        </h2>

                        <p>

                            ${reasons.join("<br>")}

                        </p>

                    </div>

                `;

            }

        }

    );

}