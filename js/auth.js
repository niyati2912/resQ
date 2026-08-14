const authForm = document.getElementById("authForm");
const authMessage = document.getElementById("authMessage");


function showMessage(message, isError = false) {

    if (!authMessage) return;

    authMessage.textContent = message;

    authMessage.style.color = isError
        ? "#dc2626"
        : "#16a34a";
}


function getUsers() {

    return JSON.parse(
        localStorage.getItem("resqUsers")
    ) || [];
}


function saveUsers(users) {

    localStorage.setItem(
        "resqUsers",
        JSON.stringify(users)
    );
}


function setCurrentUser(user) {

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


function handleSignup() {

    const name =
        document.getElementById("name").value.trim();

    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

    const phone =
        document.getElementById("phone").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const bloodGroup =
        document.getElementById("bloodGroup").value;

    const role =
        document.getElementById("role").value;

    const password =
        document.getElementById("password").value;


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


    if (password.length < 6) {

        showMessage(
            "Password must be at least 6 characters.",
            true
        );

        return;
    }


    const users = getUsers();


    const existingUser = users.find(
        user => user.email === email
    );


    if (existingUser) {

        showMessage(
            "An account with this email already exists.",
            true
        );

        return;
    }


    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password,

        phone: phone,

        city: city,

        bloodGroup: bloodGroup,

        role: role,

        available: role === "Donor"
    };


    users.push(newUser);

    saveUsers(users);

    setCurrentUser(newUser);


    showMessage(
        "Account created successfully. Redirecting..."
    );


    setTimeout(() => {

        window.location.href =
            "dashboard.html";

    }, 1000);
}


function handleLogin() {

    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("password").value;


    if (!email || !password) {

        showMessage(
            "Please enter your email and password.",
            true
        );

        return;
    }


    const users = getUsers();


    const user = users.find(
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


    setCurrentUser(user);


    showMessage(
        "Login successful. Redirecting..."
    );


    setTimeout(() => {

        window.location.href =
            "dashboard.html";

    }, 1000);
}


if (authForm) {

    authForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const mode =
                authForm.dataset.mode;


            if (mode === "signup") {

                handleSignup();

            } else if (mode === "login") {

                handleLogin();

            }

        }
    );
}