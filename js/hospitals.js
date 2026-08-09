const searchInput =
    document.getElementById("hospitalSearch");

const searchButton =
    document.getElementById("hospitalSearchBtn");

const mapMessage =
    document.getElementById("mapMessage");

const resultsContainer =
    document.getElementById("hospitalResults");

const resultCount =
    document.getElementById("hospitalResultCount");

const filterButtons =
    document.querySelectorAll(
        "[data-map-filter]"
    );


let map = null;

let markersLayer = null;

let currentPlaces = [];

let activeFilter = "all";



function setMessage(
    message,
    type = ""
) {

    mapMessage.textContent =
        message;

    mapMessage.className =
        "map-message";

    if (type) {

        mapMessage.classList.add(
            type
        );

    }

}



function createMap() {

    map = L.map(
        "resqMap",
        {
            zoomControl: true
        }
    ).setView(
        [22.9734, 78.6569],
        5
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(
        map
    );


    markersLayer =
        L.layerGroup().addTo(
            map
        );

}



async function geocodeCity(
    city
) {

    const url =
        new URL(
            "https://nominatim.openstreetmap.org/search"
        );


    url.searchParams.set(
        "q",
        `${city}, India`
    );


    url.searchParams.set(
        "format",
        "jsonv2"
    );


    url.searchParams.set(
        "limit",
        "1"
    );


    url.searchParams.set(
        "countrycodes",
        "in"
    );


    url.searchParams.set(
        "featureType",
        "city"
    );


    const response =
        await fetch(
            url,
            {
                headers: {
                    "Accept":
                        "application/json"
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            "City search failed."
        );

    }


    const data =
        await response.json();


    if (
        !data.length
    ) {

        throw new Error(
            "City not found."
        );

    }


    return {

        lat:
            Number(
                data[0].lat
            ),

        lon:
            Number(
                data[0].lon
            ),

        name:
            data[0].display_name

    };

}



function buildOverpassQuery(
    lat,
    lon
) {

    return `

        [out:json][timeout:30];

        (

            nwr[
                "amenity"="hospital"
            ](
                around:15000,
                ${lat},
                ${lon}
            );

            nwr[
                "healthcare"="hospital"
            ](
                around:15000,
                ${lat},
                ${lon}
            );

            nwr[
                "healthcare"="clinic"
            ](
                around:15000,
                ${lat},
                ${lon}
            );

            nwr[
                "healthcare"="blood_bank"
            ](
                around:15000,
                ${lat},
                ${lon}
            );

            nwr[
                "amenity"="blood_bank"
            ](
                around:15000,
                ${lat},
                ${lon}
            );

            nwr[
                "healthcare"="blood_centre"
            ](
                around:15000,
                ${lat},
                ${lon}
            );

            nwr[
                "healthcare"="blood_center"
            ](
                around:15000,
                ${lat},
                ${lon}
            );

        );

        out center tags;

    `;

}



async function queryOverpass(
    lat,
    lon
) {

    const query =
        buildOverpassQuery(
            lat,
            lon
        );


    const endpoints = [

        "https://overpass-api.de/api/interpreter",

        "https://overpass.kumi.systems/api/interpreter"

    ];


    let lastError;


    for (
        const endpoint
        of endpoints
    ) {

        try {

            const response =
                await fetch(
                    endpoint,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=UTF-8"
                        },

                        body:
                            query
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Overpass returned ${response.status}`
                );

            }


            return await response.json();

        }

        catch (error) {

            lastError =
                error;

        }

    }


    throw lastError ||
        new Error(
            "Unable to query Overpass."
        );

}



function getElementPosition(
    element
) {

    if (
        element.type ===
        "node"
    ) {

        return {

            lat:
                element.lat,

            lon:
                element.lon

        };

    }


    if (
        element.center
    ) {

        return {

            lat:
                element.center.lat,

            lon:
                element.center.lon

        };

    }


    return null;

}



function classifyPlace(
    tags
) {

    const name =
        (
            tags.name ||
            ""
        ).toLowerCase();


    const healthcare =
        (
            tags.healthcare ||
            ""
        ).toLowerCase();


    const amenity =
        (
            tags.amenity ||
            ""
        ).toLowerCase();


    if (

        healthcare ===
            "blood_bank"

        ||

        healthcare ===
            "blood_centre"

        ||

        healthcare ===
            "blood_center"

        ||

        amenity ===
            "blood_bank"

        ||

        name.includes(
            "blood bank"
        )

        ||

        name.includes(
            "blood centre"
        )

        ||

        name.includes(
            "blood center"
        )

    ) {

        return "blood-bank";

    }


    return "hospital";

}



function normalizePlace(
    element
) {

    const position =
        getElementPosition(
            element
        );


    if (!position) {

        return null;

    }


    const tags =
        element.tags ||
        {};


    const category =
        classifyPlace(
            tags
        );


    const name =
        tags.name ||
        (
            category === "blood-bank"
                ? "Blood Bank"
                : "Hospital"
        );


    const addressParts = [

        tags["addr:housenumber"],

        tags["addr:street"],

        tags["addr:suburb"],

        tags["addr:city"]

    ].filter(
        Boolean
    );


    const address =
        addressParts.length
            ? addressParts.join(
                ", "
            )
            : "Address not available";


    return {

        id:
            `${element.type}-${element.id}`,

        name,

        category,

        lat:
            position.lat,

        lon:
            position.lon,

        address,

        phone:
            tags.phone ||
            tags["contact:phone"] ||
            "",

        website:
            tags.website ||
            tags["contact:website"] ||
            "",

        openingHours:
            tags.opening_hours ||
            ""

    };

}



function clearMap() {

    markersLayer.clearLayers();

}



function markerColor(
    category
) {

    if (
        category ===
        "blood-bank"
    ) {

        return "#8e2c20";

    }


    return "#b53e2c";

}



function createMarkerIcon(
    category
) {

    return L.divIcon({

        className:
            "resq-map-marker",

        html: `

            <span
                style="
                    background:${markerColor(
                        category
                    )};
                "
            ></span>

        `,

        iconSize:
            [22, 22],

        iconAnchor:
            [11, 11]

    });

}



function createPopup(
    place
) {

    const category =
        place.category ===
        "blood-bank"
            ? "Blood Bank"
            : "Hospital";


    const phone =
        place.phone
            ? `
                <a
                    href="tel:${place.phone}"
                >
                    ${place.phone}
                </a>
            `
            : "";


    const website =
        place.website
            ? `
                <a
                    href="${place.website}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Website
                </a>
            `
            : "";


    return `

        <div class="resq-map-popup">

            <span class="popup-type">
                ${category}
            </span>


            <h3>
                ${escapeHtml(
                    place.name
                )}
            </h3>


            <p>
                ${escapeHtml(
                    place.address
                )}
            </p>


            ${
                phone
                    ? `
                        <p>
                            ${phone}
                        </p>
                    `
                    : ""
            }


            <div class="popup-actions">

                <a
                    href="https://www.google.com/maps/search/?api=1&query=${
                        place.lat
                    },${
                        place.lon
                    }"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Directions
                </a>

                ${website}

            </div>

        </div>

    `;

}



function renderMarkers() {

    clearMap();


    const visiblePlaces =
        currentPlaces.filter(
            place => {

                if (
                    activeFilter ===
                    "all"
                ) {

                    return true;

                }


                return (
                    place.category ===
                    activeFilter
                );

            }
        );


    visiblePlaces.forEach(
        place => {

            const marker =
                L.marker(
                    [
                        place.lat,
                        place.lon
                    ],
                    {
                        icon:
                            createMarkerIcon(
                                place.category
                            )
                    }
                );


            marker.bindPopup(
                createPopup(
                    place
                )
            );


            marker.addTo(
                markersLayer
            );

        }
    );


    resultCount.textContent =
        `${visiblePlaces.length} result${
            visiblePlaces.length === 1
                ? ""
                : "s"
        }`;


    renderResults(
        visiblePlaces
    );

}



function renderResults(
    places
) {

    resultsContainer.innerHTML =
        "";


    if (
        places.length === 0
    ) {

        resultsContainer.innerHTML = `

            <div class="empty-hospitals">

                <strong>
                    No places found.
                </strong>

                <p>
                    Try another city or filter.
                </p>

            </div>

        `;

        return;

    }


    places.forEach(
        place => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "hospital-item";


            card.innerHTML = `

                <div class="hospital-item-head">

                    <div
                        class="place-type ${
                            place.category
                        }"
                    >

                        ${
                            place.category ===
                            "blood-bank"
                                ? "Blood Bank"
                                : "Hospital"
                        }

                    </div>

                </div>


                <h3>

                    ${escapeHtml(
                        place.name
                    )}

                </h3>


                <p>

                    ${escapeHtml(
                        place.address
                    )}

                </p>


                ${
                    place.phone
                        ? `
                            <p class="place-phone">

                                ${escapeHtml(
                                    place.phone
                                )}

                            </p>
                        `
                        : ""
                }


                <div class="hospital-actions">

                    <button
                        class="place-focus btn btn-outline"
                        type="button"
                    >
                        Show on map
                    </button>


                    <a
                        class="action-link"
                        href="https://www.google.com/maps/search/?api=1&query=${
                            place.lat
                        },${
                            place.lon
                        }"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Directions
                    </a>

                </div>

            `;


            card
                .querySelector(
                    ".place-focus"
                )
                .addEventListener(
                    "click",
                    () => {

                        map.setView(
                            [
                                place.lat,
                                place.lon
                            ],
                            16
                        );


                        L.popup()
                            .setLatLng(
                                [
                                    place.lat,
                                    place.lon
                                ]
                            )
                            .setContent(
                                createPopup(
                                    place
                                )
                            )
                            .openOn(
                                map
                            );

                    }
                );


            resultsContainer.appendChild(
                card
            );

        }
    );

}



function escapeHtml(
    value
) {

    return String(
        value
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}



async function searchCity() {

    const city =
        searchInput.value.trim();


    if (!city) {

        setMessage(
            "Enter a city such as Ambala, Chandigarh or Delhi.",
            "warning"
        );

        return;

    }


    searchButton.disabled =
        true;


    searchButton.textContent =
        "Searching";


    setMessage(
        `Finding medical facilities in ${city}...`
    );


    resultsContainer.innerHTML =
        `

            <div class="empty-hospitals">

                <strong>
                    Searching...
                </strong>

                <p>
                    Finding hospitals and blood banks.
                </p>

            </div>

        `;


    try {

        const location =
            await geocodeCity(
                city
            );


        map.setView(
            [
                location.lat,
                location.lon
            ],
            13
        );


        const response =
            await queryOverpass(
                location.lat,
                location.lon
            );


        const places =
            response.elements
                .map(
                    normalizePlace
                )
                .filter(
                    Boolean
                );


        const unique =
            new Map();


        places.forEach(
            place => {

                if (
                    !unique.has(
                        place.id
                    )
                ) {

                    unique.set(
                        place.id,
                        place
                    );

                }

            }
        );


        currentPlaces =
            Array.from(
                unique.values()
            );


        renderMarkers();


        if (
            currentPlaces.length
        ) {

            const hospitalCount =
                currentPlaces.filter(
                    place =>
                        place.category ===
                        "hospital"
                ).length;


            const bloodBankCount =
                currentPlaces.filter(
                    place =>
                        place.category ===
                        "blood-bank"
                ).length;


            setMessage(
                `${hospitalCount} hospitals and ${bloodBankCount} blood-bank listings found around ${city}.`,
                "success"
            );

        }

        else {

            setMessage(
                `No mapped hospitals or blood banks were found around ${city}.`,
                "warning"
            );

        }

    }

    catch (error) {

        console.error(
            error
        );


        currentPlaces =
            [];


        clearMap();


        renderMarkers();


        setMessage(
            "We could not load this city. Try another Indian city.",
            "error"
        );

    }

    finally {

        searchButton.disabled =
            false;


        searchButton.textContent =
            "Search";

    }

}



filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                activeFilter =
                    button.dataset.mapFilter;


                renderMarkers();

            }
        );

    }
);


searchButton.addEventListener(
    "click",
    searchCity
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            searchCity();

        }

    }
);


createMap();