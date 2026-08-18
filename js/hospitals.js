const hospitalSearch = document.getElementById("hospitalSearch");
const hospitalSearchBtn = document.getElementById("hospitalSearchBtn");
const hospitalResults = document.getElementById("hospitalResults");
const hospitalResultCount = document.getElementById("hospitalResultCount");
const mapMessage = document.getElementById("mapMessage");

const filterButtons = [
    ...document.querySelectorAll("[data-map-filter]")
];

let map = null;
let markersLayer = null;
let facilities = [];
let activeFilter = "all";


function setMessage(message, isError = false) {
    if (!mapMessage) return;

    mapMessage.textContent = message;

    mapMessage.className = isError
        ? "map-message map-message-error"
        : "map-message";
}


function escapeHtml(value = "") {
    return String(value).replace(
        /[&<>'"]/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        }[char])
    );
}


function initMap() {
    if (!window.L || map) return;

    const mapElement = document.getElementById("resqMap");

    if (!mapElement) return;

    map = L.map("resqMap").setView(
        [22.9734, 78.6569],
        5
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
}


function normalizeFacility(element) {
    const tags = element.tags || {};

    const amenity = tags.amenity || "";
    const healthcare = tags.healthcare || "";
    const name = tags.name || tags["name:en"];

    const bloodFacility =
        amenity === "blood_bank" ||
        healthcare === "blood_bank" ||
        healthcare === "blood_centre" ||
        healthcare === "blood_center";

    const type = bloodFacility
        ? "blood-bank"
        : "hospital";

    const lat =
        element.lat ??
        element.center?.lat;

    const lon =
        element.lon ??
        element.center?.lon;

    return {
        id: `${element.type}-${element.id}`,

        name:
            name ||
            (
                type === "hospital"
                    ? "Unnamed hospital"
                    : "Unnamed blood facility"
            ),

        type,

        lat: Number(lat),
        lon: Number(lon),

        address:
            [
                tags["addr:housenumber"],
                tags["addr:street"],
                tags["addr:suburb"],
                tags["addr:city"],
                tags["addr:state"]
            ]
                .filter(Boolean)
                .join(", ") ||
            "Address not listed",

        phone:
            tags.phone ||
            tags["contact:phone"] ||
            "Not listed"
    };
}


function getFilteredFacilities() {
    if (activeFilter === "all") {
        return facilities;
    }

    return facilities.filter(
        facility =>
            facility.type === activeFilter
    );
}


function focusFacility(id) {
    const facility = facilities.find(
        item => item.id === id
    );

    if (!facility || !map) return;

    map.setView(
        [facility.lat, facility.lon],
        16
    );

    L.popup()
        .setLatLng(
            [facility.lat, facility.lon]
        )
        .setContent(
            `
            <strong>${escapeHtml(facility.name)}</strong>
            <br>
            ${escapeHtml(facility.address)}
            `
        )
        .openOn(map);
}


function renderMarkers(list) {
    if (!markersLayer || !window.L) return;

    markersLayer.clearLayers();

    list.forEach(facility => {
        const marker = L.marker(
            [facility.lat, facility.lon]
        );

        marker.bindPopup(
            `
            <strong>${escapeHtml(facility.name)}</strong>
            <br>
            ${escapeHtml(facility.address)}
            <br>
            <small>
                ${facility.type === "hospital"
                    ? "Hospital"
                    : "Blood Facility"}
            </small>
            `
        );

        marker.addTo(markersLayer);
    });
}


function renderResults() {
    const list = getFilteredFacilities();

    if (hospitalResultCount) {
        hospitalResultCount.textContent =
            `${list.length} result${
                list.length === 1 ? "" : "s"
            }`;
    }

    if (hospitalResults) {
        if (!list.length) {
            hospitalResults.innerHTML = `
                <div class="empty-hospitals">
                    <strong>No matching facilities found.</strong>
                    <p>
                        Try another city or switch the filter.
                    </p>
                </div>
            `;
        } else {
            hospitalResults.innerHTML = list
                .map(
                    facility => `
                        <article class="hospital-item">
                            <div class="hospital-item-top">
                                <span class="facility-type ${facility.type}">
                                    ${
                                        facility.type === "hospital"
                                            ? "Hospital"
                                            : "Blood Facility"
                                    }
                                </span>
                            </div>

                            <h3>
                                ${escapeHtml(facility.name)}
                            </h3>

                            <p>
                                ${escapeHtml(facility.address)}
                            </p>

                            <p>
                                ${
                                    facility.phone === "Not listed"
                                        ? "Contact information not listed"
                                        : `Phone: ${escapeHtml(
                                            facility.phone
                                        )}`
                                }
                            </p>

                            <button
                                type="button"
                                class="btn btn-outline hospital-focus-btn"
                                data-facility-id="${escapeHtml(
                                    facility.id
                                )}"
                            >
                                View on map
                            </button>
                        </article>
                    `
                )
                .join("");

            hospitalResults
                .querySelectorAll("[data-facility-id]")
                .forEach(button => {
                    button.addEventListener(
                        "click",
                        () => {
                            focusFacility(
                                button.dataset.facilityId
                            );
                        }
                    );
                });
        }
    }

    renderMarkers(list);
}


async function geocodeCity(city) {
    const url =
        "https://nominatim.openstreetmap.org/search" +
        `?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(
            `${city}, India`
        )}`;

    const response = await fetch(url, {
        headers: {
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(
            "Could not locate that city."
        );
    }

    const data = await response.json();

    if (!data.length) {
        throw new Error(
            "City not found. Please enter a valid Indian city."
        );
    }

    return {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
        name: data[0].display_name
    };
}


async function fetchFacilities(lat, lon) {
    const query = `
        [out:json][timeout:25];

        (
            node(
                around:15000,
                ${lat},
                ${lon}
            )[amenity=hospital];

            way(
                around:15000,
                ${lat},
                ${lon}
            )[amenity=hospital];

            relation(
                around:15000,
                ${lat},
                ${lon}
            )[amenity=hospital];

            node(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=hospital];

            way(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=hospital];

            relation(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=hospital];

            node(
                around:15000,
                ${lat},
                ${lon}
            )[amenity=blood_bank];

            way(
                around:15000,
                ${lat},
                ${lon}
            )[amenity=blood_bank];

            relation(
                around:15000,
                ${lat},
                ${lon}
            )[amenity=blood_bank];

            node(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=blood_bank];

            way(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=blood_bank];

            node(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=blood_centre];

            way(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=blood_centre];

            node(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=blood_center];

            way(
                around:15000,
                ${lat},
                ${lon}
            )[healthcare=blood_center];
        );

        out center tags;
    `;

    const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "text/plain;charset=UTF-8"
            },

            body: query
        }
    );

    if (!response.ok) {
        throw new Error(
            "The medical facility service is temporarily unavailable."
        );
    }

    const data = await response.json();

    return data.elements || [];
}


async function searchHospitals() {
    const city =
        hospitalSearch?.value.trim();

    if (!city) {
        setMessage(
            "Please enter an Indian city.",
            true
        );

        hospitalSearch?.focus();

        return;
    }

    initMap();

    setMessage(
        `Finding hospitals and blood facilities in ${city}...`
    );

    if (hospitalSearchBtn) {
        hospitalSearchBtn.disabled = true;
        hospitalSearchBtn.textContent = "Searching...";
    }

    try {
        const place =
            await geocodeCity(city);

        if (map) {
            map.setView(
                [place.lat, place.lon],
                12
            );
        }

        const elements =
            await fetchFacilities(
                place.lat,
                place.lon
            );

        const seen = new Set();

        facilities = elements
            .map(normalizeFacility)
            .filter(facility => {
                const validCoordinates =
                    Number.isFinite(facility.lat) &&
                    Number.isFinite(facility.lon);

                if (
                    !validCoordinates ||
                    seen.has(facility.id)
                ) {
                    return false;
                }

                seen.add(facility.id);

                return true;
            });

        renderResults();

        setMessage(
            `${facilities.length} mapped medical facilities found near ${city}.`
        );
    } catch (error) {
        console.error(error);

        facilities = [];

        renderResults();

        setMessage(
            error.message ||
            "Unable to search medical facilities right now.",
            true
        );
    } finally {
        if (hospitalSearchBtn) {
            hospitalSearchBtn.disabled = false;

            hospitalSearchBtn.innerHTML =
                `
                <i data-lucide="search"></i>
                Search
                `;

            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }
}


if (hospitalSearchBtn) {
    hospitalSearchBtn.addEventListener(
        "click",
        searchHospitals
    );
}


if (hospitalSearch) {
    hospitalSearch.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                event.preventDefault();
                searchHospitals();
            }
        }
    );
}


filterButtons.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            activeFilter =
                button.dataset.mapFilter || "all";

            filterButtons.forEach(item => {
                item.classList.toggle(
                    "active",
                    item === button
                );
            });

            renderResults();
        }
    );
});


initMap();


const params = new URLSearchParams(
    window.location.search
);

const cityFromUrl = params.get("city");

if (cityFromUrl && hospitalSearch) {
    hospitalSearch.value = cityFromUrl;
    searchHospitals();
}