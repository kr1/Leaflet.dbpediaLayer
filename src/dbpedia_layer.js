/* global L, $ */

L.DBPediaLayer = function (map) {
    var _this = this;
    this.map = map;
    L.DBPediaLayer.jMap = $(map.getContainer());
    this.markerGroup = L.layerGroup();
    this.markerGroup.addTo(this.map);
    this.visitedBounds = [];
    this._ajaxWrapper = function (newArea, notHere) {
        var query = _this.queries._assembleAreaQuery(newArea.SW, newArea.NE,
                                                           {notHere: notHere,
                                                            language: "en",
                                                            includeCities: false});
        var url = _this.queries._assembleDbpediaURL(query);
        //console.log(url)
        _this.transport._putLoader();
        _this.transport._sendQuery(url, _this._handleDbpediaData,
                            {errorCallback:
                                function () {
                                    notHere.pop();
                                    //exports.map.fireEvent("moveend")
                                },
                             completeCallback:
                                 function () {}
                            });
    };

    this._handleDbpediaData = function (data) {
        var list = data.results.bindings;
        //console.log(list);
        _this._addDBPediaLayer(list);
    };

    map.on("moveend", function () {
        if (_this.map.hasLayer(_this.markerGroup)) {
            var bounds = _this.map.getBounds(),
                SW = bounds._southWest,
                NE = bounds._northEast,
                areaToLoad = _this.utils._identifyAreaToLoad({SW: SW, NE: NE}, _this.visitedBounds);
            //console.log("to_load: ", areaToLoad)
            if (areaToLoad) {
                _this._ajaxWrapper(areaToLoad.current, areaToLoad.not);
            }
            _this.visitedBounds.push({SW: SW, NE: NE});
        }
    });

    this._addDBPediaLayer = function (list) {
        var idx;
        for (idx = 0; idx < list.length ; idx++) {
            var entry = list[idx],
                position =  [entry.lat.value, entry.lng.value],
                text = "<h3>" + entry.label.value + "</h3>";
            text += "<a title='" + entry.link.value + "'href='" + entry.link.value + "'>more info</a><br/>";
            text += "<br/>" + position + "<br/>";
            text += "<img src='" + entry.thumbnail.value + "' style='width:200px;'/>";
            this.markerGroup.addLayer(L.marker(position).bindPopup(text).bindLabel(entry.label.value));
        }
    };
    return this.markerGroup;
};

L.dbPediaLayer = function (map) {
    return new L.DBPediaLayer(map);
};
