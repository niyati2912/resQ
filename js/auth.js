const authForm =
    document.getElementById("authForm");

const authMessage =
    document.getElementById("authMessage");


function showMessage(
    message,
    isError = false
) {

    if (!authMessage) {
        return;
    }


    authMessage.textContent =
        message;


    authMessage.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";

}


function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "resqUsers"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Unable to read users:",
            error
        );

        return [];

    }

}


function saveUsers(
    users
) {

    localStorage.setItem(
        "resqUsers",
        JSON.stringify(users)
    );

}


function setCurrentUser(
    user
) {

    localStorage.setItem(
        "resqCurrentUser",
        JSON.stringify({

            id:
                user.id,

            name:
                user.name,

            email:
                user.email,

            phone:
                user.phone,

            city:
                user.city,

            bloodGroup:
                user.bloodGroup,

            role:
                user.role,

            available:
                user.available

        })
    );

}


function syncUserAsDonor(
    user
) {

    if (
        user.role !== "Donor"
    ) {
        return;
    }


    let donors = [];


    try {

        donors =
            JSON.parse(
                localStorage.getItem(
                    "resqDonors"
                )
            ) || [];

    } catch (error) {

        donors = [];

    }


    const donorIndex =
        donors.findIndex(
            donor =>
                donor.phone ===
                user.phone
        );


    const donorData = {

        id:
            user.id,

        name:
            user.name,

        bloodGroup:
            user.bloodGroup,

        phone:
            user.phone,

        city:
            user.city,

        availability:
            user.available
                ? "Available"
                : "Unavailable"

    };


    if (
        donorIndex !== -1
    ) {

        donors[donorIndex] = {

            ...donors[donorIndex],

            ...donorData

        };

    } else {

        donors.push(
            donorData
        );

    }


    localStorage.setItem(
        "resqDonors",
        JSON.stringify(donors)
    );

}


function handleSignup() {

    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();


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


    const bloodGroup =
        document
            .getElementById("bloodGroup")
            .value;


    const role =
        document
            .getElementById("role")
            .value;


    const password =
        document
            .getElementById("password")
            .value;


    if (
        !name ||
        !email ||
        !phone ||
        !city ||
        !bloodGroup ||
        !role ||
        !password
    ) {

        showMessage(
            "Please fill in all fields.",
            true
        );

        return;

    }


    if (
        !/^[0-9]{10}$/.test(
            phone
        )
    ) {

        showMessage(
            "Please enter a valid 10-digit phone number.",
            true
        );

        return;

    }


    if (
        password.length < 6
    ) {

        showMessage(
            "Password must be at least 6 characters.",
            true
        );

        return;

    }


    const users =
        getUsers();


    const existingUser =
        users.find(
            user =>
                user.email === email
        );


    if (existingUser) {

        showMessage(
            "An account with this email already exists.",
            true
        );

        return;

    }


    const newUser = {

        id:
            Date.now(),

        name,

        email,

        password,

        phone,

        city,

        bloodGroup,

        role,

        available:
            role === "Donor"

    };


    users.push(
        newUser
    );


    saveUsers(
        users
    );


    syncUserAsDonor(
        newUser
    );


    setCurrentUser(
        newUser
    );


    showMessage(
        "Account created successfully. Redirecting..."
    );


    setTimeout(
        function () {

            window.location.href =
                "dashboard.html";

        },
        1000
    );

}


function handleLogin() {

    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById("password")
            .value;


    if (
        !email ||
        !password
    ) {

        showMessage(
            "Please enter your email and password.",
            true
        );

        return;

    }


    const users =
        getUsers();


    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password
        );


    if (!user) {

        showMessage(
            "Invalid email or password.",
            true
        );

        return;

    }


    setCurrentUser(
        user
    );


    showMessage(
        "Login successful. Redirecting..."
    );


    setTimeout(
        function () {

            window.location.href =
                "dashboard.html";

        },
        1000
    );

}


document
    .querySelectorAll(
        "[data-password-toggle]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const input =
                        document.getElementById(
                            this.dataset
                                .passwordToggle
                        );


                    if (!input) {
                        return;
                    }


                    const showPassword =
                        input.type ===
                        "password";


                    input.type =
                        showPassword
                            ? "text"
                            : "password";


                    this.innerHTML =
                        showPassword
                            ? '<i data-lucide="eye-off"></i>'
                            : '<i data-lucide="eye"></i>';


                    if (window.lucide) {

                        lucide.createIcons();

                    }

                }
            );

        }
    );


if (authForm) {

    authForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const mode =
                authForm.dataset.mode;


            if (
                mode === "signup"
            ) {

                handleSignup();

            }

            else if (
                mode === "login"
            ) {

                handleLogin();

            }

        }
    );

}