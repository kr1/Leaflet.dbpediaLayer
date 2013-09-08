(function(exports){
    function parsePageResults(res){
      if (isCountQuery(res)){
        handleCountQuery(res);
        return;
      }
      //queries.stop_loading_animation();
      var list = res.results.bindings
      return list
    }
    exports.parsePageResults = parsePageResults;

    function isCountQuery(res){
      console.log(res)
      return res.head.vars.indexOf('count') != -1
    }

    function handleCountQuery(res){
        var count = Number(res.results.bindings[0].count.value)
        if (count > 1000) {
          abortCurrentAjaxContentCall()
        }
        $('#result_count_monitor').text(String(count) + " entries")
    }
    function abortCurrentAjaxContentCall(){
        dbpLayer.queries.currentAjax.abort();
        dbpLayer.queries.currentAjax = null
    }
})(typeof exports === 'undefined' ? this['dbpParser'] = {} : exports)
