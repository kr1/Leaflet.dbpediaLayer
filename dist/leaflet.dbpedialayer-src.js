/* global L, iconB64Src, loaderB64Src */

L.DBpediaLayer = L.LayerGroup.extend({
    initialize: function (options) {
        var prefKeys = [["displayThumbnail", true], ["displayPosition", true], ["displayTypes", true],
                        ["displayAbstract", true], ["displayLink", true], ["includeCities", false],
                        ["displayMarkerLabel", true], ["lang", "en"]];
        this.dbp.prefs = {};
        for (var key in prefKeys) {
            this.dbp.prefs[prefKeys[key][0]] = (
                options[prefKeys[key][0]] === undefined ?
                prefKeys[key][1] :
                options[prefKeys[key][0]]);
        }
        this.dbp.prefs.loaderGif = options.loaderGif || null;
        this.dbp.prefs.icon = options.icon || null;
        this.dbp.icon = this.dbp._makeIcon();
        this._layers = {};
        this.dbp.style = document.createElement("style");
        this.dbp.style.innerHTML = ".dbpPopup>img {width:188px;};";
        document.body.appendChild(this.dbp.style);
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
                } else {
                    _this.dbp.visitedBounds = [];
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
                                                                language: this.prefs.lang || "en",
                                                                includeCities: this.prefs.includeCities});
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
                    desc = this.utils._shortenAbstract(entry.abstract.value),
                    types = this.utils._cleanupTypes(entry.types.value),
                    text = "<div class='dbpPopup'>";
                text += "<h3 class='dbpPopupTitle'>" + entry.label.value + "</h3>";
                if (this.prefs.displayPosition) {
                    text += position + " ";
                }
                if (this.prefs.displayLink) {
                    text += " <a class='dbpPopupWikipediaLink' title='wikipedia' href='" + langUrl + "'>";
                    text += "more info</a><br/>";
                }
                if (this.prefs.displayAbstract) {
                    text += desc + "<br/>";
                }
                if (this.prefs.displayTypes) {
                    text += "Tags: " + types + "<br/>";
                }
                if (this.prefs.displayThumbnail) {
                    text += "<img class='dbpPopupThumbnail' src='" + entry.thumbnail.value + "'/>";
                }
                text += "</div>";
                var _mark = L.marker(position, {icon: this.icon}).bindPopup(text);
                if (!!L.Label && this.prefs.displayMarkerLabel) {
                    _mark = _mark.bindLabel(entry.label.value);
                }
                this.layer.addLayer(_mark);
            }
        },
        _putLoader: function () {
            if (typeof this.loaderGif === "undefined") {
                var gif = document.createElement("img");
                gif.src = this.prefs.loaderGif || "data:image/gif;base64," + loaderB64Src;
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
        },
        _makeIcon: function () {
            return L.icon({
                iconUrl: (this.prefs.icon && this.prefs.icon.iconUrl) || "data:image/png;base64," + iconB64Src,
                iconSize: (this.prefs.icon && this.prefs.icon.iconSize) || [20, 33],
                iconAnchor: (this.prefs.icon && this.prefs.icon.iconAnchor) || [16, 35],
                popupAnchor: (this.prefs.icon && this.prefs.icon.popupAnchor) || [-6, -25]
            });
        }

    }
});

L.dbPediaLayer = function (options) {
    return new L.DBpediaLayer(options || {});
};


/*global escape */
(function (exports) {
    function _assembleDbpediaURL(query) {
        //console.log(query);
        return "http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" +
                   escape(query) + "&format=json";
    }
    exports._assembleDbpediaURL = _assembleDbpediaURL;

    /** _assembleAreaQuery() - assembles a SPARQL query for resources in a specified area.
     *
     * @param {object} SW - SouthWest corner
     * @param {object} NE - NorthEast corner
     * both SW and NE must have the following format {lat:NN.NN, lng:NN.NN}
     *
     * @param {object} options:
     *                     - notHere: list(areas): areas to exclude in the query, format [obj, obj]:
     *                                 obj must have the following format:
     *                                    {SW:{lat:NN.NN, lng:NN.NN},
     *                                     NE:{lat:NN.NN, lng: NN.NN}}
     *                     - language {string}, default: 'en'
     *                     - includeCities {bool}, default: false
     *                          NB: by default populated places (dbpedia-owl:PopulatedPlace) are excluded from the query
     *                     - typeUrl {string} SPARQL-URL-string (e.g. <http://queries for: 'rdf:type')
     * @returns {string} q - the assembled query
     */
    exports._assembleAreaQuery = function (positionSW, positionNE, options) {
        options = options || {};
        var lang = options.language,
            typeQueryHead = options.typeUrl ? "" : " (GROUP_CONCAT(?type; separator=',') as ?types) ",
            q = "SELECT DISTINCT (str(?label) as ?label) ?lng ?lat ?abstract ?link ?thumbnail ";
        q += typeQueryHead + " WHERE {";
        q += "       ?res <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?lng.";
        q += "       ?res <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat.";
        q += "       ?res rdfs:label ?label .";
        q += "       ?res foaf:isPrimaryTopicOf ?link.";
        q += "       ?res <http://dbpedia.org/ontology/thumbnail> ?thumbnail.";
        q += "       ?res <http://dbpedia.org/ontology/abstract> ?abstract.";
        if (options.typeUrl) {
            q += "      ?res rdf:type " + options.typeUrl;
        } else {
            q += "      ?res rdf:type  ?type_url .";
            q += "      ?type_url rdfs:label ?type .";
        }
        if (!options.includeCities && !options.typeUrl) {
            q += "      MINUS {?res a <http://dbpedia.org/ontology/PopulatedPlace>}.";
        }
        q += "      FILTER ((?lng > " + positionSW.lng + "  AND ?lng < " + positionNE.lng;
        q += "      AND ?lat > " + positionSW.lat + " AND ?lat < " + positionNE.lat + ") AND ";
        if (options.notHere) {
            for (var idx = 0 ; idx < options.notHere.length ; idx++) {
                var area = options.notHere[idx];
                q += "      !(?lng > " + area.SW.lng + "  AND ?lng < " + area.NE.lng;
                q += "      AND ?lat > " + area.SW.lat + " AND ?lat < " + area.NE.lat + ") AND ";
            }
        }
        q += "      LANG(?label)='" + lang + "' AND";
        q += "      LANG(?abstract)='" + lang + "'";
        if (!options.typeUrl) {
            q += "      AND LANG(?type)='en')";
        }
        q += "  } Limit 1000";
        return q;
    };
})(typeof exports === "undefined" ?  L.DBpediaLayer.prototype.dbp.queries : exports);


(function (exports) {
    exports._cleanupTypes = function (types) {
        types = types.replace(/,place|place,/, "");
        var split = types.split(",");
        split = split.sort(function (a, b) {
            return a.length - b.length;
        });
        return split.join(", ");
    };
    exports._langLink = function (url, lang) {
        if (lang === "en") {
            return url;
        }
        return url.replace("://dbp", "://" + lang);
    };

    exports._shortenAbstract = function (abs) {
        var split = abs.split(" ");
        return split.slice(0, 24).join(" ") + (split.length > 24 ? "..." : "");
    };

    function _identifyAreaToLoad(current, priorAreas) {
        var not = [];
        for (var idx = 0 ; idx < priorAreas.length ; idx++) {
            var area = priorAreas[idx];
            if (_overlapping(current, area)) {
                not.push(area);
            }
        }
        return {"current": current, not: not};
    }
    exports._identifyAreaToLoad = _identifyAreaToLoad;

    function _overlapping(areaA, areaB) {
        if (offNorth(areaA, areaB) ||
            offEast(areaA, areaB) ||
            offSouth(areaA, areaB) ||
            offWest(areaA, areaB)) {
            return false;
        } else {
            return true;
        }
    }
    exports._overlapping = _overlapping;

    function offNorth(areaA, areaB) {
        // areaB lies north of areaA
        return northBound(areaA) < southBound(areaB);
    }

    function offEast(areaA, areaB) {
        // areaB lies east of areaA
        return eastBound(areaA) < westBound(areaB);
    }

    function offSouth(areaA, areaB) {
        // areaB lies east of areaA
        return southBound(areaA) > northBound(areaB);
    }

    function offWest(areaA, areaB) {
        // areaB lies west of areaA
        return westBound(areaA) > eastBound(areaB);
    }

    function northBound(area) {
        return area.NE.lat;
    }

    function eastBound(area) {
        return area.NE.lng;
    }

    function southBound(area) {
        return area.SW.lat;
    }

    function westBound(area) {
        return area.SW.lng;
    }
})(typeof exports === "undefined" ?  L.DBpediaLayer.prototype.dbp.utils : exports);


/* jshint unused: false, maxlen: false */
var loaderB64Src = "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";


/* jshint unused: false, maxlen: false */
var iconB64Src = "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";


(function (proto) {
    /**
     * sendQuery() sends an ajax call. it accepts the following params
     * @param {string} url
     * @param {function} successCallback
     * @param {object} options:
     *                     - trackLoading -> function, to visualize query progress
     *                     - errorCallback -> function
     *                     - completeCallback -> function
     * @returns {number} lastAjax
     */
    function sendQuery(url, successCallback, options) {
        options = options || {};
        var ajaxSetup = {
            dataType: "json",
            url: url,
            success: successCallback
        };
        if (options.completeCallback) {
            ajaxSetup.complete = function () {
                options.completeCallback();
            };
        }
        if (options.errorCallback) {
            ajaxSetup.error = options.errorCallback;
        }
        if (options.trackLoading) {
            ajaxSetup.progress = options.trackLoading;
        }
        var req = new XMLHttpRequest();
        req.open("GET", ajaxSetup.url, true);
        req.onreadystatechange = function () {
            if (req.readyState !== 4 || req.status !== 200) {
                return;
            } else {
                var data = (JSON.parse(req.responseText));
                ajaxSetup.success(data);
            }
            ajaxSetup.complete();
        };
        req.send();
        proto.currentAjax = req;
        return req;
    }
    proto._sendQuery = sendQuery;
})(typeof exports === "undefined" ?  L.DBpediaLayer.prototype.dbp.transport : exports);


