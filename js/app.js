const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const collapseBtn = document.getElementById("collapseBtn");
const themeBtn = document.getElementById("themeBtn");
const language = document.getElementById("language");

function icons() {
    if (window.lucide) lucide.createIcons();
}

function getCurrentUser() {
    try {
        const raw = localStorage.getItem("resqCurrentUser");
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error("Unable to read current user:", e);
        return null;
    }
}

if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () =>
        sidebar.classList.toggle("open")
    );
}

if (collapseBtn && sidebar) {
    collapseBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");

        localStorage.setItem(
            "resqSidebarCollapsed",
            String(sidebar.classList.contains("collapsed"))
        );
    });
}

if (
    sidebar &&
    localStorage.getItem("resqSidebarCollapsed") === "true"
) {
    sidebar.classList.add("collapsed");
}

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark", isDark);

    document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
    );

    localStorage.setItem(
        "resqTheme",
        isDark ? "dark" : "light"
    );

    if (themeBtn) {
        themeBtn.innerHTML = isDark
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';

        icons();
    }
}

applyTheme(
    localStorage.getItem("resqTheme") === "dark"
        ? "dark"
        : "light"
);

if (themeBtn) {
    themeBtn.addEventListener("click", () =>
        applyTheme(
            document.body.classList.contains("dark")
                ? "light"
                : "dark"
        )
    );
}

const translations = {
    en: {
        home: "Home",
        find: "Find Blood",
        hospitals: "Hospitals",
        dashboard: "Dashboard",
        eligibility: "Eligibility",
        compatibility: "Compatibility",
        resources: "Resources",
        account: "Account"
    },

    hi: {
        home: "होम",
        find: "रक्त खोजें",
        hospitals: "अस्पताल",
        dashboard: "डैशबोर्ड",
        eligibility: "पात्रता",
        compatibility: "अनुकूलता",
        resources: "संसाधन",
        account: "अकाउंट"
    },

    pa: {
        home: "ਹੋਮ",
        find: "ਖੂਨ ਲੱਭੋ",
        hospitals: "ਹਸਪਤਾਲ",
        dashboard: "ਡੈਸ਼ਬੋਰਡ",
        eligibility: "ਯੋਗਤਾ",
        compatibility: "ਅਨੁਕੂਲਤਾ",
        resources: "ਸਰੋਤ",
        account: "ਅਕਾਊਂਟ"
    }
};

function applyLanguage(lang) {
    const dict = translations[lang];

    if (!dict) return;

    document.querySelectorAll("[data-t]").forEach(el => {
        if (dict[el.dataset.t]) {
            el.textContent = dict[el.dataset.t];
        }
    });

    localStorage.setItem("resqLanguage", lang);
}

const savedLanguage =
    localStorage.getItem("resqLanguage") || "en";

if (language) {
    language.value =
        translations[savedLanguage]
            ? savedLanguage
            : "en";

    language.addEventListener("change", e =>
        applyLanguage(e.target.value)
    );
}

applyLanguage(
    translations[savedLanguage]
        ? savedLanguage
        : "en"
);

function updateTopAccountButton() {
    const user = getCurrentUser();

    document.querySelectorAll(".account-btn").forEach(button => {
        button.href = user
            ? "account.html"
            : "login.html";

        const text = button.querySelector("span");

        if (text) {
            text.textContent = user
                ? (user.name || "My Account")
                : "Account";
        }
    });
}

function getOrCreateAccountSection() {
    let section =
        document.getElementById("accountSection");

    if (section) return section;

    const nav = document.querySelector(".nav");

    if (!nav) return null;

    const labels = [
        ...nav.querySelectorAll(":scope > .nav-label")
    ];

    const label = labels.find(
        el =>
            el.textContent
                .trim()
                .toLowerCase() === "account"
    );

    if (!label) return null;

    section = document.createElement("div");
    section.id = "accountSection";

    label.parentNode.insertBefore(section, label);
    section.appendChild(label);

    let next = section.nextElementSibling;

    while (
        next &&
        next.classList.contains("nav-link")
    ) {
        const current = next;

        next = next.nextElementSibling;

        section.appendChild(current);
    }

    return section;
}

function closeMobileSidebar() {
    if (sidebar) {
        sidebar.classList.remove("open");
    }
}

function updateActiveNavigation() {
    const page =
        location.pathname.split("/").pop() ||
        "index.html";

    document.querySelectorAll(".nav-link").forEach(link => {
        const href =
            (link.getAttribute("href") || "")
                .split("?")[0];

        link.classList.toggle(
            "active",
            href === page ||
            link.dataset.page === page
        );
    });
}

function updateAccountSection() {
    const section =
        getOrCreateAccountSection();

    if (!section) {
        updateTopAccountButton();
        return;
    }

    const user = getCurrentUser();

    section.innerHTML =
        '<div class="nav-label">Account</div>';

    if (user) {
        const account =
            document.createElement("a");

        account.className = "nav-link";
        account.href = "account.html";
        account.dataset.page = "account.html";

        account.innerHTML =
            '<i data-lucide="circle-user-round"></i>' +
            '<span class="nav-text"></span>';

        account.querySelector(".nav-text").textContent =
            user.name || "My Account";

        account.addEventListener(
            "click",
            closeMobileSidebar
        );

        const logout =
            document.createElement("button");

        logout.type = "button";
        logout.className =
            "nav-link logout-btn";

        logout.innerHTML =
            '<i data-lucide="log-out"></i>' +
            '<span class="nav-text">Logout</span>';

        logout.addEventListener("click", () => {
            localStorage.removeItem(
                "resqCurrentUser"
            );

            location.href = "index.html";
        });

        section.append(account, logout);

    } else {
        section.insertAdjacentHTML(
            "beforeend",
            `
            <a
                class="nav-link"
                data-page="login.html"
                href="login.html"
            >
                <i data-lucide="log-in"></i>
                <span class="nav-text">Login</span>
            </a>

            <a
                class="nav-link"
                data-page="signup.html"
                href="signup.html"
            >
                <i data-lucide="user-plus"></i>
                <span class="nav-text">Sign Up</span>
            </a>
            `
        );

        section
            .querySelectorAll(".nav-link")
            .forEach(link =>
                link.addEventListener(
                    "click",
                    closeMobileSidebar
                )
            );
    }

    updateTopAccountButton();
    updateActiveNavigation();
    icons();
}

updateAccountSection();
updateTopAccountButton();
updateActiveNavigation();
icons();