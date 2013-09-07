(function(exports){
    function ajax_wrapper(new_area, not_here){
        var query = exports.queries.assembles_area_query(new_area.SW, new_area.NE,
                                                           {not_here: not_here,
                                                            language: 'en',
                                                            include_cities: false})
        var url = exports.queries.assemble_dbpedia_url(query);
        console.log(url)
        dbpLayer.transport.putLoader();
        dbpLayer.transport.send_query(url, handle_dbpedia_data, 
                           {errorCallback:
                             function(e){
                                 console.log(not_here.length)
                                 not_here.pop();
                                 console.log(not_here.length)
                                 //exports.map.fireEvent('moveend')
                             },
                           completeCallback: 
                             function(e){
                               console.log('removing');
                             }
                           })
    }
    exports.ajax_wrapper = ajax_wrapper;

    function handle_dbpedia_data(data){
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
                
                var bounds = exports.map.getBounds();
                //console.log(bounds)
                var SW = bounds._southWest;
                var NE = bounds._northEast;
                var area_to_load = exports.utils.identify_area_to_load({SW: SW, NE: NE}, exports.visitedBounds);
                console.log("to_load: ", area_to_load)
                if (area_to_load){
                    var callId = exports.ajax_wrapper(area_to_load.new, area_to_load.not);
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
             var entry = list[idx];
             var position =  [entry.lat.value, entry.lng.value];
             console.log("pos:" + position);
             var text = "<h3>" + entry.label.value + "</h3>";
             text += "<a title='" + entry.link.value + "'href='" + entry.link.value +"'>more info</a><br/>";
             text += "<br/>" + position + "<br/>";
             text += "<img src='" + entry.thumbnail.value +"' style='width:200px;'/>";
             exports.markerGroup.addLayer(L.marker(position).bindPopup(text).bindLabel(entry.label.value));
        }
    }
})(typeof exports === 'undefined' ? this['dbpLayer'] = {} : exports)
