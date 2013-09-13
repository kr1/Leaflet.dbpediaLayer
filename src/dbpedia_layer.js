/* global L, b64Src */

L.DBpediaLayer = L.LayerGroup.extend({
    initialize: function (options) {
        this._layers = {};
        console.log(options);
        this.dbp.lang = options.lang || "en";
        this.dbp.includeCities = !!options.includeCities;

    },
    onAdd: function (map) {
        this.dbp.map = map;
        this._map = map;
        this.dbp.layer = this;
        var _this = this;
        map.on("moveend",
            function () {
                if (map.hasLayer(_this)) {
                    var bounds = map.getBounds(),
                        SW = bounds._southWest,
                        NE = bounds._northEast,
                        areaToLoad = _this.dbp.utils._identifyAreaToLoad({SW: SW, NE: NE}, _this.dbp.visitedBounds);
                    //console.log("to_load: ", areaToLoad)
                    if (areaToLoad) {
                        _this.dbp._ajaxWrapper(areaToLoad.current, areaToLoad.not);
                    }
                    _this.dbp.visitedBounds.push({SW: SW, NE: NE});
                }
            }
        );
    },
    dbp: {
        utils: {},
        queries: {},
        transport: {},
        visitedBounds: [],
        _ajaxWrapper: function (newArea, notHere) {
            var query = this.queries._assembleAreaQuery(newArea.SW, newArea.NE,
                                                               {notHere: notHere,
                                                                language: this.lang || "en",
                                                                includeCities: this.includeCities});
            var url = this.queries._assembleDbpediaURL(query);
            var _this = this;
            this._putLoader();
            this.transport._sendQuery(url, this._handleDbpediaData,
                                {errorCallback:
                                    function () {
                                        notHere.pop();
                                    },
                                 completeCallback:
                                     function () {
                                            _this._removeLoader();
                                        }
                                });
        },

        _handleDbpediaData: function (data) {
            var list = data.results.bindings;
            L.DBpediaLayer.prototype.dbp._addDBpediaLayer(list);
        },

        _addDBpediaLayer: function (list) {
            var idx;
            for (idx = 0; idx < list.length ; idx++) {
                var entry = list[idx],
                    position =  [entry.lat.value, entry.lng.value],
                    langUrl = this.utils._langLink(entry.link.value, this.lang),
                    text = "<h3>" + entry.label.value + "</h3>";
                text += "<br/>" + position;
                text += " - <a class='wikipediaLink' title='" + langUrl + "'href='" + entry.link.value + "'>";
                text += "more info</a>";
                text += "<br/>" + entry.abstract.value + "<br/>";
                text += "<img src='" + entry.thumbnail.value + "' style='width:200px;'/>";
                var _mark = L.marker(position).bindPopup(text).bindLabel(entry.label.value);
                this.layer.addLayer(_mark);
            }
        },
        _putLoader: function () {
            if (typeof this.loaderGif === "undefined") {
                var gif = document.createElement("img");
                gif.src = "data:image/gif;base64," + b64Src;
                gif.id = "dbpedialayer.loaderGif";
                gif.style.position = "absolute";
                gif.style.width = "64px";
                gif.style.top = "14px";
                gif.style.left =  "48%";
                this.loaderGif = gif;
                var parentElement = this.map.getContainer();
                parentElement.appendChild(gif);
                //L.DBpediaLayer.jMap.append(gif);
            } else {
                this.loaderGif.style.display = "block";
            }
        },
        _removeLoader: function () {
            this.loaderGif.style.display = "none";
        }
    }
});

L.dbPediaLayer = function (options) {
    return new L.DBpediaLayer(options || {});
};
