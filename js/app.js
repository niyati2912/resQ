const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const collapseBtn = document.getElementById("collapseBtn");
const themeBtn = document.getElementById("themeBtn");
const language = document.getElementById("language");


function icons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}


function setTheme(value) {

    document.body.classList.toggle(
        "dark",
        value === "dark"
    );

    localStorage.setItem(
        "resqTheme",
        value
    );

    
    if (themeBtn) {

        themeBtn.innerHTML =
            value === "dark"
                ? '<i data-lucide="sun"></i>'
                : '<i data-lucide="moon"></i>';
    }

    
    icons();
}

setTheme(
    localStorage.getItem("resqTheme") || "light"
);


if (themeBtn) {

    themeBtn.onclick = () => {

        const newTheme =
            document.body.classList.contains("dark")
                ? "light"
                : "dark";

        setTheme(newTheme);
    };
}


if (menuBtn) {

    menuBtn.onclick = () => {

        if (window.innerWidth <= 850) {

            sidebar.classList.toggle("open");
        }
        else {

            sidebar.classList.toggle("collapsed");
        }
    };
}

if (collapseBtn) {

    collapseBtn.onclick = () => {

        sidebar.classList.toggle("collapsed");

    };
}



const page =
    location.pathname.split("/").pop()
    || "index.html";


document
    .querySelectorAll(".nav-link[data-page]")
    .forEach(link => {

        if (link.dataset.page === page) {

            link.classList.add("active");

        }
    });


document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.onclick = () => {

            if (sidebar) {

                sidebar.classList.remove("open");

            }
        };
    });


const dict = {

    en: {

        home: "Home",
        find: "Find Blood",
        hospitals: "Hospitals",
        dashboard: "Dashboard",
        eligibility: "Eligibility",
        compatibility: "Compatibility",
        resources: "Resources",
        account: "Account",
        login: "Login",
        signup: "Sign Up",
        emergency: "I Need Blood Now"
    },


    hi: {

        home: "होम",
        find: "रक्त खोजें",
        hospitals: "अस्पताल",
        dashboard: "डैशबोर्ड",
        eligibility: "पात्रता",
        compatibility: "संगतता",
        resources: "संसाधन",
        account: "खाता",
        login: "लॉगिन",
        signup: "साइन अप",
        emergency: "मुझे अभी रक्त चाहिए"
    },


    pa: {

        home: "ਹੋਮ",
        find: "ਖੂਨ ਲੱਭੋ",
        hospitals: "ਹਸਪਤਾਲ",
        dashboard: "ਡੈਸ਼ਬੋਰਡ",
        eligibility: "ਯੋਗਤਾ",
        compatibility: "ਅਨੁਕੂਲਤਾ",
        resources: "ਸਰੋਤ",
        account: "ਖਾਤਾ",
        login: "ਲੌਗਇਨ",
        signup: "ਸਾਈਨ ਅੱਪ",
        emergency: "ਮੈਨੂੰ ਹੁਣੇ ਖੂਨ ਚਾਹੀਦਾ ਹੈ"
    }
};


function applyLanguage(value) {

    const d = dict[value] || dict.en;


    document
        .querySelectorAll("[data-t]")
        .forEach(element => {

            const key = element.dataset.t;

            if (d[key]) {

                element.textContent = d[key];

            }
        });


    localStorage.setItem(
        "resqLanguage",
        value
    );


    if (language) {

        language.value = value;

    }


    document.documentElement.lang = value;
}


if (language) {

    const savedLanguage =
        localStorage.getItem("resqLanguage")
        || "en";


    applyLanguage(savedLanguage);


    language.onchange = event => {

        applyLanguage(
            event.target.value
        );
    };
}


icons();