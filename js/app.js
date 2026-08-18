const sidebar =
    document.getElementById(
        "sidebar"
    );

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const collapseBtn =
    document.getElementById(
        "collapseBtn"
    );

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

const language =
    document.getElementById(
        "language"
    );


/* =========================================
   ICONS
========================================= */

function icons() {

    if (window.lucide) {

        lucide.createIcons();

    }

}


/* =========================================
   SIDEBAR
========================================= */

if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


if (collapseBtn && sidebar) {

    collapseBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "collapsed"
            );

            localStorage.setItem(
                "resqSidebarCollapsed",
                sidebar.classList.contains(
                    "collapsed"
                )
            );

        }
    );

}


if (
    sidebar &&
    localStorage.getItem(
        "resqSidebarCollapsed"
    ) === "true"
) {

    sidebar.classList.add(
        "collapsed"
    );

}


/* =========================================
   THEME
========================================= */

function applyTheme(
    theme
) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );


    localStorage.setItem(
        "resqTheme",
        theme
    );


    if (!themeBtn) {
        return;
    }


    themeBtn.innerHTML =
        theme === "dark"
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';


    icons();

}


const savedTheme =
    localStorage.getItem(
        "resqTheme"
    );


if (savedTheme) {

    applyTheme(
        savedTheme
    );

}


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        function () {

            const currentTheme =
                document.documentElement.getAttribute(
                    "data-theme"
                );


            applyTheme(
                currentTheme === "dark"
                    ? "light"
                    : "dark"
            );

        }
    );

}


/* =========================================
   LANGUAGE
========================================= */

const translations = {

    en: {

        home:
            "Home",

        find:
            "Find Blood",

        hospitals:
            "Hospitals",

        dashboard:
            "Dashboard",

        eligibility:
            "Eligibility",

        compatibility:
            "Compatibility",

        resources:
            "Resources",

        account:
            "Account"

    },

    hi: {

        home:
            "होम",

        find:
            "रक्त खोजें",

        hospitals:
            "अस्पताल",

        dashboard:
            "डैशबोर्ड",

        eligibility:
            "पात्रता",

        compatibility:
            "अनुकूलता",

        resources:
            "संसाधन",

        account:
            "अकाउंट"

    },

    pa: {

        home:
            "ਹੋਮ",

        find:
            "ਖੂਨ ਲੱਭੋ",

        hospitals:
            "ਹਸਪਤਾਲ",

        dashboard:
            "ਡੈਸ਼ਬੋਰਡ",

        eligibility:
            "ਯੋਗਤਾ",

        compatibility:
            "ਅਨੁਕੂਲਤਾ",

        resources:
            "ਸਰੋਤ",

        account:
            "ਅਕਾਊਂਟ"

    }

};


function applyLanguage(
    lang
) {

    const dictionary =
        translations[lang];


    if (!dictionary) {
        return;
    }


    document
        .querySelectorAll(
            "[data-t]"
        )
        .forEach(
            element => {

                const key =
                    element.dataset.t;


                if (
                    dictionary[key]
                ) {

                    element.textContent =
                        dictionary[key];

                }

            }
        );


    localStorage.setItem(
        "resqLanguage",
        lang
    );

}


const savedLanguage =
    localStorage.getItem(
        "resqLanguage"
    );


if (
    savedLanguage &&
    translations[savedLanguage]
) {

    if (language) {

        language.value =
            savedLanguage;

    }


    applyLanguage(
        savedLanguage
    );

}


if (language) {

    language.addEventListener(
        "change",
        function (event) {

            applyLanguage(
                event.target.value
            );

        }
    );

}


/* =========================================
   GET CURRENT USER
========================================= */

function getCurrentUser() {

    try {

        const data =
            localStorage.getItem(
                "resqCurrentUser"
            );


        return data
            ? JSON.parse(data)
            : null;

    } catch (error) {

        console.error(
            "Unable to read current user:",
            error
        );

        return null;

    }

}


/* =========================================
   UPDATE TOP ACCOUNT BUTTON
========================================= */

function updateTopAccountButton() {

    const accountButtons =
        document.querySelectorAll(
            ".account-btn"
        );


    if (
        !accountButtons.length
    ) {
        return;
    }


    const currentUser =
        getCurrentUser();


    accountButtons.forEach(
        function (button) {

            if (currentUser) {

                button.href =
                    "account.html";


                const text =
                    button.querySelector(
                        "span"
                    );


                if (text) {

                    text.textContent =
                        currentUser.name ||
                        "Account";

                }

            }

            else {

                button.href =
                    "login.html";


                const text =
                    button.querySelector(
                        "span"
                    );


                if (text) {

                    text.textContent =
                        "Account";

                }

            }

        }
    );

}


/* =========================================
   UPDATE SIDEBAR ACCOUNT SECTION
========================================= */

function updateAccountSection() {

    const accountSection =
        document.getElementById(
            "accountSection"
        );


    if (!accountSection) {

        updateTopAccountButton();

        return;

    }


    const currentUser =
        getCurrentUser();


    accountSection.innerHTML =
        "";


    const label =
        document.createElement(
            "div"
        );


    label.className =
        "nav-label";


    label.textContent =
        "Account";


    accountSection.appendChild(
        label
    );


    if (!currentUser) {

        const loginLink =
            document.createElement(
                "a"
            );


        loginLink.className =
            "nav-link";


        loginLink.dataset.page =
            "login.html";


        loginLink.href =
            "login.html";


        loginLink.innerHTML =
            `
                <i data-lucide="log-in"></i>

                <span class="nav-text">
                    Login
                </span>
            `;


        const signupLink =
            document.createElement(
                "a"
            );


        signupLink.className =
            "nav-link";


        signupLink.dataset.page =
            "signup.html";


        signupLink.href =
            "signup.html";


        signupLink.innerHTML =
            `
                <i data-lucide="user-plus"></i>

                <span class="nav-text">
                    Sign Up
                </span>
            `;


        accountSection.appendChild(
            loginLink
        );


        accountSection.appendChild(
            signupLink
        );

    }

    else {

        const userLink =
            document.createElement(
                "a"
            );


        userLink.className =
            "nav-link";


        userLink.dataset.page =
            "account.html";


        /* THIS WAS THE BUG */

        userLink.href =
            "account.html";


        userLink.innerHTML =
            `
                <i data-lucide="circle-user-round"></i>

                <span class="nav-text"></span>
            `;


        userLink
            .querySelector(
                ".nav-text"
            )
            .textContent =
            currentUser.name ||
            "My Account";


        const logoutButton =
            document.createElement(
                "button"
            );


        logoutButton.type =
            "button";


        logoutButton.className =
            "nav-link logout-btn";


        logoutButton.innerHTML =
            `
                <i data-lucide="log-out"></i>

                <span class="nav-text">
                    Logout
                </span>
            `;


        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "resqCurrentUser"
                );


                window.location.href =
                    "index.html";

            }
        );


        accountSection.appendChild(
            userLink
        );


        accountSection.appendChild(
            logoutButton
        );

    }


    updateTopAccountButton();


    icons();


    updateActiveNavigation();

}


/* =========================================
   ACTIVE NAVIGATION
========================================= */

function updateActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
        ||
        "index.html";


    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(
            function (link) {

                const page =
                    link.dataset.page;


                link.classList.toggle(
                    "active",
                    page === currentPage
                );

            }
        );

}


/* =========================================
   CLOSE MOBILE SIDEBAR
========================================= */

document
    .querySelectorAll(
        ".nav-link"
    )
    .forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (sidebar) {

                        sidebar.classList.remove(
                            "open"
                        );

                    }

                }
            );

        }
    );


/* =========================================
   INITIALIZE
========================================= */

updateAccountSection();

updateTopAccountButton();

updateActiveNavigation();

icons();