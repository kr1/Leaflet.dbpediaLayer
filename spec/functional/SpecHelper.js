function reinitializeMap(map, options) {
    var mapContainerParent = map.getContainer().parentNode,
        newMapContainer = document.createElement('div');
    removeMap(map);
    newMapContainer.id = 'Map';
    mapContainerParent.appendChild(newMapContainer);
    map = initializeMap(options);
    return map
}

function removeMap(map) {
    var mapContainerParent = map.getContainer().parentNode;
    mapContainerParent.removeChild(map.getContainer());
}

function initializeMap(options) {
    map = L.map('Map', {
                        zoom: 11,
                        center: new L.LatLng(41.29, 13.29)}),
    lay = L.dbPediaLayer(options || {}).addTo(map);
    return map
}
