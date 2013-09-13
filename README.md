#Leaflet.dbpediaLayer


Leaflet.dbpediaLayer is a easy to use plugin for adding a layer with POIs from Wikipedia.
It does so by querying the [SPARQL endpoint](http://dbpedia.org/sparql) at DBpedia.

##Demo

Check out the [demo](http://dbpedialayer.zanstaen.org).


##Usage

    var lay = L.dbpediaLayer({lang: 'de', includeCities: false}).addTo(map);

###Options

| Option | Type | Default | Description  
| --- | --- | --- | ---  
| lang | String | `en` | the language used in the query (NB: english has by far the most results).  
| includeCities | Boolean | `false` | Whether resources of type PopulatedPlace are included in the results.  

##License

See LICENSE file in the project root.
