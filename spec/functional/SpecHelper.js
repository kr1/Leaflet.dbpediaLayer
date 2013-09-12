function reinitializeMap(map) {
    var mapContainerParent = map.getContainer().parentNode,
        newMapContainer = document.createElement('div');
    mapContainerParent.removeChild(map.getContainer());
    newMapContainer.id = 'Map';
    mapContainerParent.appendChild(newMapContainer);
    map = initializeMap();
    return map
}

function initializeMap(center) {
    map = L.map('Map', {
                        zoom: 11,
                        center: new L.LatLng(41.29, 13.29)}),
    lay = L.dbPediaLayer(map);
    return map
}
