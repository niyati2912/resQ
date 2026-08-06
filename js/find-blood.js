/* ========================================
   RESQ - FIND BLOOD SYSTEM
======================================== */


/* ========================================
   GET HTML ELEMENTS
======================================== */

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


/* ========================================
   CONTACT MODAL ELEMENTS
======================================== */

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


/* ========================================
   DEFAULT DONOR DATA
======================================== */

const defaultDonors = [

    {
        name: "Prachi",
        bloodGroup: "O+",
        city: "Rajpura",
        phone: "9876543210",
        availability: "Available"
    },

    {
        name: "Niyati",
        bloodGroup: "A+",
        city: "Ambala",
        phone: "9876543211",
        availability: "Available"
    },

    {
        name: "Manju",
        bloodGroup: "AB+",
        city: "Chandigarh",
        phone: "9876543212",
        availability: "Available"
    },

    {
        name: "Riya",
        bloodGroup: "B+",
        city: "Patiala",
        phone: "9876543213",
        availability: "Available"
    },

    {
        name: "Aman",
        bloodGroup: "O-",
        city: "Rajpura",
        phone: "9876543214",
        availability: "Unavailable"
    }

];


/* ========================================
   GET REGISTERED DONORS
======================================== */

const registeredDonors =

JSON.parse(

    localStorage.getItem(
        "resqDonors"
    )

) || [];


/* Combine default and registered donors */

const allDonors = [

    ...defaultDonors,

    ...registeredDonors

];


/* ========================================
   SEARCH FORM
======================================== */

bloodSearchForm.addEventListener(

    "submit",

    function (event) {

        event.preventDefault();


        const selectedBloodGroup =

        searchBloodGroup.value;


        const enteredCity =

        searchCity.value
        .trim()
        .toLowerCase();


        /* Validation */

        if (

            selectedBloodGroup === ""

            ||

            enteredCity === ""

        ) {

            searchMessage.textContent =

            "⚠️ Please select a blood group and enter a city.";


            searchMessage.className =

            "search-error";


            donorResults.innerHTML = "";


            return;

        }


        /* Filter donors */

        const matchingDonors =

        allDonors.filter(

            function (donor) {

                const donorCity =

                donor.city
                .toLowerCase();


                return (

                    donor.bloodGroup ===
                    selectedBloodGroup

                    &&

                    donorCity.includes(
                        enteredCity
                    )

                    &&

                    donor.availability ===
                    "Available"

                );

            }

        );


        /* Display results */

        displayDonors(
            matchingDonors
        );

    }

);


/* ========================================
   DISPLAY DONORS
======================================== */

function displayDonors(
    donors
) {


    donorResults.innerHTML = "";


    /* No donor found */

    if (

        donors.length === 0

    ) {

        searchMessage.textContent =

        "❌ No available donors found for this blood group and city.";


        searchMessage.className =

        "search-error";


        return;

    }


    /* Donors found */

    searchMessage.textContent =

    `✅ ${donors.length} donor(s) found!`;


    searchMessage.className =

    "search-success";


    /* Create donor cards */

    donors.forEach(

        function (donor) {


            const donorCard =

            document.createElement(
                "article"
            );


            donorCard.className =

            "donor-card";


            donorCard.innerHTML = `

                <div class="donor-card-top">

                    <div class="donor-avatar">

                        🩸

                    </div>


                    <div>

                        <h2>

                            ${donor.name}

                        </h2>


                        <p>

                            📍 ${donor.city}

                        </p>

                    </div>


                    <span class="blood-group-tag">

                        ${donor.bloodGroup}

                    </span>

                </div>


                <div class="donor-card-info">

                    <p>

                        📞 ${donor.phone}

                    </p>


                    <p>

                        🟢 ${donor.availability}

                    </p>

                </div>


                <button

                    class="contact-donor-btn"

                    data-name="${donor.name}"

                    data-blood="${donor.bloodGroup}"

                    data-city="${donor.city}"

                    data-phone="${donor.phone}"

                >

                    Contact Donor

                </button>

            `;


            donorResults.appendChild(
                donorCard
            );

        }

    );

}


/* ========================================
   OPEN CONTACT POPUP
======================================== */

document.addEventListener(

    "click",

    function (event) {


        if (

            event.target.classList.contains(
                "contact-donor-btn"
            )

        ) {


            const button =

            event.target;


            modalDonorName.textContent =

            button.dataset.name;


            modalBloodGroup.textContent =

            button.dataset.blood;


            modalCity.textContent =

            button.dataset.city;


            modalPhone.textContent =

            button.dataset.phone;


            callDonor.href =

            "tel:" +

            button.dataset.phone;


            contactModal.classList.add(

                "show-modal"

            );

        }

    }

);


/* ========================================
   CLOSE POPUP BUTTON
======================================== */

if (

    closeModal

) {

    closeModal.addEventListener(

        "click",

        function () {

            contactModal.classList.remove(

                "show-modal"

            );

        }

    );

}


/* ========================================
   CLOSE WHEN CLICKING OUTSIDE
======================================== */

if (

    contactModal

) {

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