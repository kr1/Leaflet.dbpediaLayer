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
| displayThumbnail | Boolean | true | Whether to display a thumbnail in the popup.
| displayPosition  | Boolean | true | s.o.
| displayTypes     | Boolean | true | s.o.
| displayAbstract  | Boolean | true | s.o.
| displayLink      | Boolean | true | s.o.


###Recommendations
DBpedia's SPARQL-endpoint serves all geo-localized resources present in Wikipedia (i.e. hundreds of thousands). Queries over a vast territory tend to be somewhat slow.  
In order to assure good usability and snappy results we recommend setting a `minZoom` restriction (8 - 10, depending on the area).

##License

See LICENSE file in the project root.
