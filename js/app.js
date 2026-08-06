/* ========================================
   RESQ APP.JS
======================================== */


/* ========================================
1. DARK MODE
======================================== */

const themeToggle =
document.getElementById(
    "themeToggle"
);


if (themeToggle) {

    const savedTheme =
    localStorage.getItem(
        "resqTheme"
    );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent =
        "☀️";

    }


    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            const isDark =

            document.body.classList.contains(
                "dark-mode"
            );


            themeToggle.textContent =

            isDark
            ? "☀️"
            : "🌙";


            localStorage.setItem(

                "resqTheme",

                isDark
                ? "dark"
                : "light"

            );

        }
    );

}


/* ========================================
2. ANIMATED COUNTERS
======================================== */

const counters =
document.querySelectorAll(
    ".counter"
);


function animateCounter(
    counter
) {

    const target =

    Number(
        counter.dataset.target
    );


    let current = 0;


    const increment =

    Math.ceil(
        target / 100
    );


    function updateCounter() {

        current += increment;


        if (
            current < target
        ) {

            counter.textContent =

            current.toLocaleString();


            requestAnimationFrame(
                updateCounter
            );

        }

        else {

            counter.textContent =

            target.toLocaleString()
            + "+";

        }

    }


    updateCounter();

}


counters.forEach(

    counter => {

        animateCounter(
            counter
        );

    }

);


/* ========================================
3. TRANSLATIONS
======================================== */

const translations = {


/* ---------- ENGLISH ---------- */

en: {

    navHome:
    "Home",

    navAbout:
    "About",

    navHow:
    "How It Works",

    navEmergency:
    "Emergency",

    navDashboard:
    "Dashboard",

    becomeDonor:
    "Become a Donor",

    heroBadge:
    "❤️ Connecting Donors. Saving Lives.",

    heroTitle:
    "Every Drop Can",

    heroHighlight:
    "Save a Life.",

    heroDescription:
    "ResQ connects blood donors with people in need, making blood support faster, easier, and more accessible.",

    findBlood:
    "Find Blood Now →",

    registeredDonors:
    "Registered Donors",

    bloodRequests:
    "Blood Requests",

    livesSupported:
    "Lives Supported",

    oDonors:
    "24 Donors Available",

    aDonors:
    "18 Donors Available",

    helpNearby:
    "Help is Nearby",

    totalDonors:
    "Total Donors",

    availableDonors:
    "Available Donors",

    totalRequests:
    "Blood Requests",

    emergencyCases:
    "Emergency Cases",

    howLabel:
    "HOW RESQ WORKS",

    howTitle:
    "Help in Four Simple Steps",

    howDescription:
    "A quick and simple way to connect donors with people who need blood.",

    step1Title:
    "Register",

    step1Description:
    "Create your donor profile and add your blood group and location.",

    step2Title:
    "Search",

    step2Description:
    "Find suitable donors using blood group and city filters.",

    step3Title:
    "Connect",

    step3Description:
    "Send a request and connect with available donors quickly.",

    step4Title:
    "Save a Life",

    step4Description:
    "Donate blood and support someone during an emergency.",

    emergencyTag:
    "🚨 EMERGENCY SUPPORT",

    emergencyTitle:
    "Need Blood Urgently?",

    emergencyDescription:
    "Submit an emergency blood request and connect with available donors.",

    requestBlood:
    "Request Blood →",

    footerTagline:
    "Your Blood Can Be Someone’s ResQ.",

    footerCopyright:
    "© 2026 ResQ. Blood Donation & Emergency Support."

},


/* ---------- HINDI ---------- */

hi: {

    navHome:
    "होम",

    navAbout:
    "हमारे बारे में",

    navHow:
    "यह कैसे काम करता है",

    navEmergency:
    "आपातकाल",

    navDashboard:
    "डैशबोर्ड",

    becomeDonor:
    "रक्तदाता बनें",

    heroBadge:
    "❤️ रक्तदाताओं को जोड़ना, जीवन बचाना।",

    heroTitle:
    "रक्त की हर बूंद",

    heroHighlight:
    "एक जीवन बचा सकती है।",

    heroDescription:
    "ResQ रक्तदाताओं को जरूरतमंद लोगों से जोड़ता है और रक्त सहायता को तेज़, आसान और अधिक सुलभ बनाता है।",

    findBlood:
    "अभी रक्त खोजें →",

    registeredDonors:
    "पंजीकृत रक्तदाता",

    bloodRequests:
    "रक्त अनुरोध",

    livesSupported:
    "सहायता प्राप्त जीवन",

    oDonors:
    "24 रक्तदाता उपलब्ध",

    aDonors:
    "18 रक्तदाता उपलब्ध",

    helpNearby:
    "सहायता पास में है",

    totalDonors:
    "कुल रक्तदाता",

    availableDonors:
    "उपलब्ध रक्तदाता",

    totalRequests:
    "रक्त अनुरोध",

    emergencyCases:
    "आपातकालीन मामले",

    howLabel:
    "RESQ कैसे काम करता है",

    howTitle:
    "चार आसान चरणों में सहायता",

    howDescription:
    "रक्तदाताओं को जरूरतमंद लोगों से जोड़ने का एक तेज़ और आसान तरीका।",

    step1Title:
    "पंजीकरण करें",

    step1Description:
    "अपनी रक्तदाता प्रोफ़ाइल बनाएं और रक्त समूह व स्थान जोड़ें।",

    step2Title:
    "खोजें",

    step2Description:
    "रक्त समूह और शहर के आधार पर उपयुक्त रक्तदाता खोजें।",

    step3Title:
    "जुड़ें",

    step3Description:
    "अनुरोध भेजें और उपलब्ध रक्तदाताओं से जल्दी जुड़ें।",

    step4Title:
    "जीवन बचाएं",

    step4Description:
    "रक्तदान करें और आपातकाल में किसी की सहायता करें।",

    emergencyTag:
    "🚨 आपातकालीन सहायता",

    emergencyTitle:
    "क्या तुरंत रक्त की आवश्यकता है?",

    emergencyDescription:
    "आपातकालीन रक्त अनुरोध भेजें और उपलब्ध रक्तदाताओं से जुड़ें।",

    requestBlood:
    "रक्त का अनुरोध करें →",

    footerTagline:
    "आपका रक्त किसी के लिए ResQ बन सकता है।",

    footerCopyright:
    "© 2026 ResQ। रक्तदान और आपातकालीन सहायता।"

},


/* ---------- PUNJABI ---------- */

pa: {

    navHome:
    "ਹੋਮ",

    navAbout:
    "ਸਾਡੇ ਬਾਰੇ",

    navHow:
    "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",

    navEmergency:
    "ਐਮਰਜੈਂਸੀ",

    navDashboard:
    "ਡੈਸ਼ਬੋਰਡ",

    becomeDonor:
    "ਖੂਨ ਦਾਨੀ ਬਣੋ",

    heroBadge:
    "❤️ ਖੂਨ ਦਾਨੀਆਂ ਨੂੰ ਜੋੜਨਾ, ਜਾਨਾਂ ਬਚਾਉਣਾ।",

    heroTitle:
    "ਖੂਨ ਦੀ ਹਰ ਬੂੰਦ",

    heroHighlight:
    "ਇੱਕ ਜਾਨ ਬਚਾ ਸਕਦੀ ਹੈ।",

    heroDescription:
    "ResQ ਖੂਨ ਦਾਨੀਆਂ ਨੂੰ ਲੋੜਵੰਦ ਲੋਕਾਂ ਨਾਲ ਜੋੜਦਾ ਹੈ ਅਤੇ ਖੂਨ ਦੀ ਮਦਦ ਨੂੰ ਤੇਜ਼, ਆਸਾਨ ਅਤੇ ਵਧੇਰੇ ਪਹੁੰਚਯੋਗ ਬਣਾਉਂਦਾ ਹੈ।",

    findBlood:
    "ਹੁਣੇ ਖੂਨ ਲੱਭੋ →",

    registeredDonors:
    "ਰਜਿਸਟਰਡ ਖੂਨ ਦਾਨੀ",

    bloodRequests:
    "ਖੂਨ ਦੀਆਂ ਬੇਨਤੀਆਂ",

    livesSupported:
    "ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਜਾਨਾਂ",

    oDonors:
    "24 ਖੂਨ ਦਾਨੀ ਉਪਲਬਧ",

    aDonors:
    "18 ਖੂਨ ਦਾਨੀ ਉਪਲਬਧ",

    helpNearby:
    "ਮਦਦ ਨੇੜੇ ਹੈ",

    totalDonors:
    "ਕੁੱਲ ਖੂਨ ਦਾਨੀ",

    availableDonors:
    "ਉਪਲਬਧ ਖੂਨ ਦਾਨੀ",

    totalRequests:
    "ਖੂਨ ਦੀਆਂ ਬੇਨਤੀਆਂ",

    emergencyCases:
    "ਐਮਰਜੈਂਸੀ ਮਾਮਲੇ",

    howLabel:
    "RESQ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",

    howTitle:
    "ਚਾਰ ਆਸਾਨ ਕਦਮਾਂ ਵਿੱਚ ਮਦਦ",

    howDescription:
    "ਖੂਨ ਦਾਨੀਆਂ ਨੂੰ ਲੋੜਵੰਦ ਲੋਕਾਂ ਨਾਲ ਜੋੜਨ ਦਾ ਇੱਕ ਤੇਜ਼ ਅਤੇ ਆਸਾਨ ਤਰੀਕਾ।",

    step1Title:
    "ਰਜਿਸਟਰ ਕਰੋ",

    step1Description:
    "ਆਪਣੀ ਖੂਨ ਦਾਨੀ ਪ੍ਰੋਫਾਈਲ ਬਣਾਓ ਅਤੇ ਖੂਨ ਸਮੂਹ ਤੇ ਸਥਾਨ ਸ਼ਾਮਲ ਕਰੋ।",

    step2Title:
    "ਖੋਜੋ",

    step2Description:
    "ਖੂਨ ਸਮੂਹ ਅਤੇ ਸ਼ਹਿਰ ਦੇ ਆਧਾਰ ਤੇ ਢੁਕਵੇਂ ਖੂਨ ਦਾਨੀ ਲੱਭੋ।",

    step3Title:
    "ਜੁੜੋ",

    step3Description:
    "ਬੇਨਤੀ ਭੇਜੋ ਅਤੇ ਉਪਲਬਧ ਖੂਨ ਦਾਨੀਆਂ ਨਾਲ ਜਲਦੀ ਜੁੜੋ।",

    step4Title:
    "ਜਾਨ ਬਚਾਓ",

    step4Description:
    "ਖੂਨ ਦਾਨ ਕਰੋ ਅਤੇ ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਕਿਸੇ ਦੀ ਮਦਦ ਕਰੋ।",

    emergencyTag:
    "🚨 ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ",

    emergencyTitle:
    "ਕੀ ਤੁਰੰਤ ਖੂਨ ਦੀ ਲੋੜ ਹੈ?",

    emergencyDescription:
    "ਐਮਰਜੈਂਸੀ ਖੂਨ ਦੀ ਬੇਨਤੀ ਭੇਜੋ ਅਤੇ ਉਪਲਬਧ ਖੂਨ ਦਾਨੀਆਂ ਨਾਲ ਜੁੜੋ।",

    requestBlood:
    "ਖੂਨ ਦੀ ਬੇਨਤੀ ਕਰੋ →",

    footerTagline:
    "ਤੁਹਾਡਾ ਖੂਨ ਕਿਸੇ ਲਈ ResQ ਬਣ ਸਕਦਾ ਹੈ।",

    footerCopyright:
    "© 2026 ResQ। ਖੂਨ ਦਾਨ ਅਤੇ ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ।"

}

};


/* ========================================
4. LANGUAGE SWITCHER
======================================== */

const languageSelect =
document.getElementById(
    "languageSelect"
);


function changeLanguage(
    language
) {

    const elements =

    document.querySelectorAll(
        "[data-i18n]"
    );


    elements.forEach(

        element => {

            const key =

            element.dataset.i18n;


            if (

                translations[language]

                &&

                translations[language][key]

            ) {

                element.textContent =

                translations[language][key];

            }

        }

    );


    document.documentElement.lang =

    language;


    localStorage.setItem(

        "resqLanguage",

        language

    );

}


if (languageSelect) {

    const savedLanguage =

    localStorage.getItem(
        "resqLanguage"
    ) || "en";


    languageSelect.value =

    savedLanguage;


    changeLanguage(
        savedLanguage
    );


    languageSelect.addEventListener(

        "change",

        event => {

            changeLanguage(

                event.target.value

            );

        }

    );

}