#Leaflet.dbpediaLayer


Leaflet.dbpediaLayer is a very easy to use plugin for adding a layer with POIs from Wikipedia.
It does so by querying the SPARQL endpoint at DBpedia.

##Demo

Check out the [demo](http://dbpedialayer.zanstaen.org).


##Usage examples

    var lay = L.dbpediaLayer({lang: 'de', includeCities: false}).addTo(map);

##License

See LICENSE file in the project root.
