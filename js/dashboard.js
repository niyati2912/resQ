const totalDonors =
    document.getElementById(
        "totalDonors"
    );


const availableDonors =
    document.getElementById(
        "availableDonors"
    );


const totalRequests =
    document.getElementById(
        "totalRequests"
    );


const criticalRequests =
    document.getElementById(
        "criticalRequests"
    );


const recentDonors =
    document.getElementById(
        "recentDonors"
    );


const recentRequests =
    document.getElementById(
        "recentRequests"
    );


function loadDashboard() {


    const donors =

        JSON.parse(

            localStorage.getItem(
                "resqDonors"
            )

        ) || [];


    const requests =

        JSON.parse(

            localStorage.getItem(
                "resqRequests"
            )

        ) || [];


    const available =

        donors.filter(

            donor =>

                donor.availability ===
                "Available"

        );


    const critical =

        requests.filter(

            request =>

                request.urgency ===
                "Critical"

        );


    totalDonors.textContent =

        donors.length;


    availableDonors.textContent =

        available.length;


    totalRequests.textContent =

        requests.length;


    criticalRequests.textContent =

        critical.length;


    recentDonors.innerHTML = "";


    recentRequests.innerHTML = "";


    if (
        donors.length === 0
    ) {

        recentDonors.innerHTML = `

            <p class="empty-data">

                No donors registered yet.

            </p>

        `;

    } else {

        const latestDonors =

            donors
            .slice(-5)
            .reverse();


        latestDonors.forEach(

            donor => {

                recentDonors.innerHTML += `

                    <div class="dashboard-row">

                        <div>

                            <strong>

                                ${donor.name}

                            </strong>


                            <span>

                                📍 ${donor.city}

                            </span>

                        </div>


                        <span class="blood-tag">

                            ${donor.bloodGroup}

                        </span>

                    </div>

                `;

            }

        );

    }


    if (
        requests.length === 0
    ) {

        recentRequests.innerHTML = `

            <p class="empty-data">

                No emergency requests yet.

            </p>

        `;

    } else {

        const latestRequests =

            requests
            .slice(-5)
            .reverse();


        latestRequests.forEach(

            request => {

                recentRequests.innerHTML += `

                    <div class="dashboard-row">

                        <div>

                            <strong>

                                ${request.patientName}

                            </strong>


                            <span>

                                🏥 ${request.hospital}

                            </span>

                        </div>


                        <span class="urgency-tag">

                            ${request.urgency}

                        </span>

                    </div>

                `;

            }

        );

    }

}


loadDashboard();


document
    .getElementById(
        "refreshDashboard"
    )
    .addEventListener(

        "click",

        loadDashboard

    );