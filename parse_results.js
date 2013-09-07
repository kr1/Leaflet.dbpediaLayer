(function(exports){
    function parsePageResults(res){
      if (isCountQuery(res)){
        handle_count_query(res);
        return;
      }
      //queries.stop_loading_animation();
      var list = res.results.bindings
      return list
      console.log(list.length)
      $('#proto_free_result_div').find(':visible').remove();
      if (list.length == 0){
        $('#result_row_no_results').show();
        return
      } else {
        $('#result_row_no_results').hide();
      }
      $.each(list, function(idx, item){
          var it = $('#result_row_template').clone();
          it.show();
          var label_link = it.children('#label_section').find('a');
          label_link.attr('href', item['page']['value']);
          label_link.text(item['label']['value']);
          var url_section = it.find('#url_section');
          url_section.text(item['page']['value'].split("/")[4]);
          var wiki_link = it.children('#wiki_page_section').find('a');
          wiki_link.attr('href', item['wiki_page']['value']);
          $('#proto_free_result_div').append(it)
          if (item['desc']){
            var desc_section = it.find('#desc_section');
            desc_section.text(item.desc.value)
          }
      })
    }
    exports.parsePageResults = parsePageResults;

    function isCountQuery(res){
      console.log(res)
      return res.head.vars.indexOf('count') != -1
    }

    function handle_count_query(res){
        var count = Number(res.results.bindings[0].count.value)
        if (count > 1000) {
          abort_current_ajax_content_call()
        }
        $('#result_count_monitor').text(String(count) + " entries")
    }
    function abort_current_ajax_content_call(){
        stop_loading_animation();
        dbpLayer.queries.currentAjax.abort();
        dbpLayer.queries.currentAjax = null
    }
})(typeof exports === 'undefined' ? this['dbpParser'] = {} : exports)
