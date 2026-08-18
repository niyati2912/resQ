function loadCityFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const city =
        params.get("city");


    if (!city) {
        return;
    }


    searchInput.value =
        city;


    searchButton.click();

}


loadCityFromUrl();