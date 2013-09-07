(function(exports){
    function assemble_dbpedia_url(query){
       return "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" +
                   escape(query) + "&format=json";
    }
    exports.assemble_dbpedia_url = assemble_dbpedia_url;

    exports.assembles_area_query = function(positionSW, positionNE, options){
        // assembles a SPARQL query for resources in the specified area.
        // options:
        // - not_here: list(areas): areas to exclude in the query, format [obj, obj]: 
        //             obj must have the following format:
        //                {SW:{lat:NN.NN, lng:NN.NN,
        //                 NE:{lat:NN.NN, lng: NN.NN}}
        // - language: string, default: 'en'
        // - include_cities: bool, default: false
        //      NB: by default populated places (dbpedia-owl:PopulatedPlace) are excluded from the query
        // - type_url: SPARQL-URL-string (e.g. <http://queries for: 'rdf:type')
        options = options || {};
        var lang = options.language || 'en';
        var type_query_head = options.type_url ? "" : " (GROUP_CONCAT(?type; separator=',') as ?types) ";
        var q = "SELECT DISTINCT (str(?label) as ?label) ?lng ?lat ?link ?thumbnail " + type_query_head + " WHERE {"
        q += "       ?res <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?lng."
        q += "       ?res <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat."
        q += "       ?res rdfs:label ?label ."
        q += "       ?res foaf:isPrimaryTopicOf ?link."
        q += "       ?res <http://dbpedia.org/ontology/thumbnail> ?thumbnail."
        if (options.type_url){
            q += "      ?res rdf:type " + type_url
        } else {
            q += "      ?res rdf:type  ?type_url ."
            q += "      ?type_url rdfs:label ?type ."
        }
        if (!options.include_cities && !options.type_url){
            q += "      MINUS {?res a <http://dbpedia.org/ontology/PopulatedPlace>}."
        }
        q += "      FILTER ((?lng > " + positionSW.lng + "  AND ?lng < " + positionNE.lng
        q += "      AND ?lat > " + positionSW.lat + " AND ?lat < " + positionNE.lat + ") AND "
        if (options.not_here){
            for (var idx = 0 ; idx < options.not_here.length ; idx++) {
                var area = options.not_here[idx];
                q += "      !(?lng > " + area.SW.lng + "  AND ?lng < " + area.NE.lng
                q += "      AND ?lat > " + area.SW.lat + " AND ?lat < " + area.NE.lat + ") AND "
            }
        }
        q += "      LANG(?label)='" + lang + "'"
        if (!options.type_url){
            q += "      AND LANG(?type)='" + lang + "')"
        }
        q += "  } Limit 1000"
        return q
    }

    function assemble_class_based_query(item_url, limit){
      var q = "SELECT ?page ?label ?wiki_page WHERE { \n";
      q += "    ?page a <" + item_url + ">  .\n";
      q += "    ?page foaf:isPrimaryTopicOf ?wiki_page .\n";
      q += "    ?page rdfs:label ?label .\n";
      q += "    FILTER(lang(?label) = 'en')\n";
      q += "} " + (limit ? "LIMIT " + limit : "");
      return q
    }

    function assemble_free_text_search_query(free_text, field){
      var q = "SELECT distinct(?page) ?label ?wiki_page " + (field == 'description' ? "?desc" : "") + " WHERE {\n"
      var q_count = "SELECT count(distinct(?page)) as ?count WHERE {\n"
      var conditions = _assemble_conditions(free_text, field, Sem.current_top_level && Sem.current_top_level.url)
      q_count += conditions;
      q += conditions;
      q += "} ORDER BY ?page";
      q_count += "}";
      var url = assemble_dbpedia_url(q);
      var count_url = assemble_dbpedia_url(q_count);
      send_query(url, true);
      display_query_in_monitor(q, url);
      send_query(count_url);
      //console.log(q)
    }

    function assemble_2_classes_based_query(classA, classB){

    }

    function _assemble_conditions(free_text, field, type){
      var join1 = free_text.join("' AND '");
      var join2 = free_text.join("");
      var q = "    ?page rdfs:label ?label .\n";
      q += "    ?page foaf:isPrimaryTopicOf ?wiki_page .\n";
      if (type){
          q += "    ?page a <" + type + ">  .";
      }
      if (field == 'description'){
          q += "    ?page dbpedia-owl:abstract ?desc .";
          q += "    ?desc bif:contains \"'(" + join1 + ")' or '" + join2 + "'\"\n";
          q += "    FILTER(lang(?label)='en' AND lang(?desc)='en' AND\n";  // take only english labels
      } else {
          q += "    ?label bif:contains \"'(" + join1 + ")' or '" + join2 + "'\"\n";
          q += "    FILTER(lang(?label)='en' AND\n";  // take only english labels
      }
      q += "    NOT EXISTS {?page dbpedia-owl:wikiPageRedirects ?real_page})\n"; // filter out alternative spellings.
      return q
    }

    function display_query_in_monitor(q, url){
      $('#query_monitor_container').show();
      $('#query_monitor').html("<pre><code>" + q + "</code></pre><br/><a href=" + url.replace("sparql", "snorql") + ">run query</a>");
    }

})(typeof exports === 'undefined' ? this['dbpLayer']['queries'] = {} : exports)
