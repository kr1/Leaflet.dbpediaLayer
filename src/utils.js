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
