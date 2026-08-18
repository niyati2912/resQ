const profileForm =
    document.getElementById(
        "profileForm"
    );

const passwordForm =
    document.getElementById(
        "passwordForm"
    );


function getStorageData(
    key,
    fallback = []
) {

    try {

        const data =
            localStorage.getItem(key);

        return data
            ? JSON.parse(data)
            : fallback;

    } catch (error) {

        console.error(
            `Unable to read ${key}:`,
            error
        );

        return fallback;

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


function getCurrentUser() {

    return getStorageData(
        "resqCurrentUser",
        null
    );

}


function updateCurrentUser(
    user
) {

    localStorage.setItem(
        "resqCurrentUser",
        JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            bloodGroup: user.bloodGroup,
            role: user.role,
            available: user.available
        })
    );

}


function showMessage(
    elementId,
    message,
    isError = false
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        isError
            ? "account-message error"
            : "account-message success";

}


function loadAccount() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        window.location.href =
            "login.html";

        return;

    }


    const accountName =
        document.getElementById(
            "accountName"
        );

    const accountRole =
        document.getElementById(
            "accountRole"
        );


    accountName.textContent =
        currentUser.name;

    accountRole.textContent =
        currentUser.role ||
        "ResQ Member";


    document
        .getElementById(
            "profileName"
        )
        .value =
        currentUser.name || "";


    document
        .getElementById(
            "profileEmail"
        )
        .value =
        currentUser.email || "";


    document
        .getElementById(
            "profilePhone"
        )
        .value =
        currentUser.phone || "";


    document
        .getElementById(
            "profileCity"
        )
        .value =
        currentUser.city || "";


    document
        .getElementById(
            "profileBloodGroup"
        )
        .value =
        currentUser.bloodGroup || "";


    document
        .getElementById(
            "profileRole"
        )
        .value =
        currentUser.role || "";

}


function syncDonorData(
    user
) {

    const donors =
        getStorageData(
            "resqDonors",
            []
        );


    const donorIndex =
        donors.findIndex(
            donor =>
                donor.id === user.id ||
                donor.phone === user.phone
        );


    if (
        user.role === "Donor"
    ) {

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

    }

    else if (
        donorIndex !== -1
    ) {

        donors.splice(
            donorIndex,
            1
        );

    }


    saveStorageData(
        "resqDonors",
        donors
    );

}


if (profileForm) {

    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const currentUser =
                getCurrentUser();


            if (!currentUser) {

                window.location.href =
                    "login.html";

                return;

            }


            const name =
                document
                    .getElementById(
                        "profileName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "profileEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const phone =
                document
                    .getElementById(
                        "profilePhone"
                    )
                    .value
                    .trim();


            const city =
                document
                    .getElementById(
                        "profileCity"
                    )
                    .value
                    .trim();


            const bloodGroup =
                document
                    .getElementById(
                        "profileBloodGroup"
                    )
                    .value;


            const role =
                document
                    .getElementById(
                        "profileRole"
                    )
                    .value;


            if (
                !name ||
                !email ||
                !phone ||
                !city ||
                !bloodGroup ||
                !role
            ) {

                showMessage(
                    "profileMessage",
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
                    "profileMessage",
                    "Please enter a valid 10-digit phone number.",
                    true
                );

                return;

            }


            const users =
                getStorageData(
                    "resqUsers",
                    []
                );


            const duplicateEmail =
                users.find(
                    user =>
                        user.email === email &&
                        user.id !== currentUser.id
                );


            if (duplicateEmail) {

                showMessage(
                    "profileMessage",
                    "Another account already uses this email.",
                    true
                );

                return;

            }


            const userIndex =
                users.findIndex(
                    user =>
                        user.id ===
                        currentUser.id
                );


            if (
                userIndex === -1
            ) {

                showMessage(
                    "profileMessage",
                    "Account could not be found.",
                    true
                );

                return;

            }


            const updatedUser = {

                ...users[userIndex],

                name,
                email,
                phone,
                city,
                bloodGroup,
                role,

                available:
                    role === "Donor"

            };


            users[userIndex] =
                updatedUser;


            saveStorageData(
                "resqUsers",
                users
            );


            updateCurrentUser(
                updatedUser
            );


            syncDonorData(
                updatedUser
            );


            document
                .getElementById(
                    "accountName"
                )
                .textContent =
                updatedUser.name;


            document
                .getElementById(
                    "accountRole"
                )
                .textContent =
                updatedUser.role;


            showMessage(
                "profileMessage",
                "Profile updated successfully."
            );


            if (
                typeof updateAccountSection ===
                "function"
            ) {

                updateAccountSection();

            }

        }
    );

}


if (passwordForm) {

    passwordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const currentUser =
                getCurrentUser();


            if (!currentUser) {

                window.location.href =
                    "login.html";

                return;

            }


            const currentPassword =
                document
                    .getElementById(
                        "currentPassword"
                    )
                    .value;


            const newPassword =
                document
                    .getElementById(
                        "newPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            if (
                newPassword.length < 6
            ) {

                showMessage(
                    "passwordMessage",
                    "New password must be at least 6 characters.",
                    true
                );

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                showMessage(
                    "passwordMessage",
                    "New passwords do not match.",
                    true
                );

                return;

            }


            const users =
                getStorageData(
                    "resqUsers",
                    []
                );


            const userIndex =
                users.findIndex(
                    user =>
                        user.id ===
                        currentUser.id
                );


            if (
                userIndex === -1
            ) {

                showMessage(
                    "passwordMessage",
                    "Account could not be found.",
                    true
                );

                return;

            }


            if (
                users[userIndex].password !==
                currentPassword
            ) {

                showMessage(
                    "passwordMessage",
                    "Current password is incorrect.",
                    true
                );

                return;

            }


            users[userIndex].password =
                newPassword;


            saveStorageData(
                "resqUsers",
                users
            );


            passwordForm.reset();


            showMessage(
                "passwordMessage",
                "Password changed successfully."
            );

        }
    );

}


/* PASSWORD SHOW / HIDE */

document
    .querySelectorAll(
        "[data-password-toggle]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const inputId =
                        this.dataset
                            .passwordToggle;


                    const passwordInput =
                        document
                            .getElementById(
                                inputId
                            );


                    if (!passwordInput) {
                        return;
                    }


                    const isHidden =
                        passwordInput.type ===
                        "password";


                    passwordInput.type =
                        isHidden
                            ? "text"
                            : "password";


                    this.setAttribute(
                        "aria-label",
                        isHidden
                            ? "Hide password"
                            : "Show password"
                    );


                    this.innerHTML =
                        isHidden
                            ? '<i data-lucide="eye-off"></i>'
                            : '<i data-lucide="eye"></i>';


                    if (window.lucide) {

                        lucide.createIcons();

                    }

                }
            );

        }
    );


loadAccount();