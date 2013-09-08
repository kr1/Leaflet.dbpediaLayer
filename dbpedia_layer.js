(function(exports){
    function ajaxWrapper(newArea, notHere){
        var query = exports.queries.assembleAreaQuery(newArea.SW, newArea.NE,
                                                           {notHere: notHere,
                                                            language: 'en',
                                                            includeCities: false})
        var url = exports.queries.assembleDbpediaURL(query);
        //console.log(url)
        dbpLayer.transport.putLoader();
        dbpLayer.transport.sendQuery(url, handleDbpediaData,
                           {errorCallback:
                             function(e){
                                 console.log(notHere.length)
                                 notHere.pop();
                                 console.log(notHere.length)
                                 //exports.map.fireEvent('moveend')
                             },
                           completeCallback: 
                             function(e){
                               console.log('removing');
                             }
                           })
    }
    exports.ajaxWrapper = ajaxWrapper;

    function handleDbpediaData(data){
        var list = dbpParser.parsePageResults(data);
        console.log(list);
        console.log("giro");
        addDBPediaLayer(list);
    }

    exports.initializeDBPediaLayer = function(map){
        exports.map = map;
        exports.jMap = $(map.getContainer());
        exports.markerGroup = L.layerGroup();
        exports.markerGroup.addTo(exports.map);
        exports.visitedBounds = [];
        map.on('moveend', function(e){
            if (exports.map.hasLayer(exports.markerGroup)){
                var bounds = exports.map.getBounds(),
                    SW = bounds._southWest,
                    NE = bounds._northEast,
                    areaToLoad = exports.utils.identifyAreaToLoad({SW: SW, NE: NE}, exports.visitedBounds);
                //console.log("to_load: ", areaToLoad)
                if (areaToLoad){
                    var callId = exports.ajaxWrapper(areaToLoad.new, areaToLoad.not);
                    console.log(callId);
                }
                exports.visitedBounds.push({SW: SW, NE: NE});
            }
        });
        return exports.markerGroup
    }
    function addDBPediaLayer(list){
        var markers = [];
        for (var idx = 0; idx < list.length ; idx++) {
             var entry = list[idx],
                 position =  [entry.lat.value, entry.lng.value],
                 text = "<h3>" + entry.label.value + "</h3>";
             console.log("pos:" + position);
             text += "<a title='" + entry.link.value + "'href='" + entry.link.value +"'>more info</a><br/>";
             text += "<br/>" + position + "<br/>";
             text += "<img src='" + entry.thumbnail.value +"' style='width:200px;'/>";
             exports.markerGroup.addLayer(L.marker(position).bindPopup(text).bindLabel(entry.label.value));
        }
    }
})(typeof exports === 'undefined' ? this['dbpLayer'] = {} : exports)
