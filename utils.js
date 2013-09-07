(function(exports){
    function identify_area_to_load(current, prior_areas){
        var not = [];
        console.log("check: ", current, prior_areas)
        for (var idx = 0 ; idx < prior_areas.length ; idx++){
            var area = prior_areas[idx];
            console.log("overlapping?: ", current, area)
            if (overlapping(current, area)){
                console.log("overlapping: ", current, area)
                not.push(area)
            }
        }
        return {'new': current, not: not}
    }
    exports.identify_area_to_load = identify_area_to_load;

    function overlapping(areaA, areaB){
        if (offNorth(areaA, areaB) ||
            offEast(areaA, areaB) ||
            offSouth(areaA, areaB) ||
            offWest(areaA, areaB)){
            return false
        } else {
            return true
        }
    }

    function offNorth(areaA, areaB){
        // areaB lies north of areaA
        return northBound(areaA) < southBound(areaB)
    }

    function offEast(areaA, areaB){
        // areaB lies east of areaA
        return eastBound(areaA) < westBound(areaB)
    }

    function offSouth(areaA, areaB){
        // areaB lies east of areaA
        return southBound(areaA) > northBound(areaB)
    }

    function offWest(areaA, areaB){
        // areaB lies west of areaA
        return westBound(areaA) > eastBound(areaB)
    }

    function northBound(area){
        return area.NE.lat;
    }

    function eastBound(area){
        return area.NE.lng;
    }

    function southBound(area){
        return area.SW.lat;
    }

    function westBound(area){
        return area.SW.lng;
    }
})(typeof exports == 'undefined' ? this['dbpLayer']['utils'] = {} : exports)
