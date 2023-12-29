let MapToken = mapToken
mapboxgl.accessToken = MapToken;
    const map = new mapboxgl.Map({
    container: 'map',
    center: [long, lat],
    zoom: 12
});

const markerElement = document.createElement('div');
markerElement.className = 'marker';
markerElement.innerHTML = '<div class="marker-div"><div class="inner-div"></div><i class="fa-brands fa-airbnb marker"></i></div>';

const div = window.document.createElement('div');
div.innerHTML = '<p class="popup-message">Exact location provided after booking.</p>';

const marker1 = new mapboxgl.Marker(markerElement)
    .setLngLat([long, lat])
    .setPopup(new mapboxgl.Popup({ maxWidth: "400px" })
    .setDOMContent(div))
    .addTo(map);