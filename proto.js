
Sem.current_top_level = null
Sem.cloud = {};
Sem.cloud.y_stretch = 210;
Sem.cloud.x_stretch = 250;
Sem.assemble_dbpedia_url =  function(query){
   return "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + 
               escape(query) + "&format=json";
  }
Sem.flatten_classes = function(){
    res_arr = [];
       $.each(Sem.classes_all_flat, function(idx, item){
          res_arr = res_arr.concat(item.label)
       })
    Sem.classes_flat = res_arr
}
Sem.flatten_classes();

$(document).ready(function(){
    // for FREE
    $('#proto_free_text_input').on('change', function(e){
       assemble_free_text_search_query();
    })
     $('#proto_free_category_input').autocomplete(
       {source: Sem.classes_flat,
        change: function(e){},
        select: function(e, ui){
          var name = $('#proto_free_category_input').val();
          var full = _.select(Sem.classes_all_flat, function(ele){return ele.label == name})[0]
          console.log(full);
          Sem.current_top_level = full
          $('#current_free_search_category').text(name)
        },
       }
     )
    $(document).on('click', '.cloud_link', function(e){
      var name = $(this).attr('id');
      var item_url = $(this).data('target_url');
      Sem.current_second_level = {'label': name, 'url': item_url};
      set_currently_searching_monitor([Sem.current_top_level.label, Sem.current_second_level.label])
      var query = assemble_class_based_query(Sem.current_second_level.url);
      var url = Sem.assemble_dbpedia_url(query);
      display_query_in_monitor(query, url);
      send_query(url);
    });
    $(document).on('mouseenter', '.proto_pic', function(e){
       var which = $(this).attr('id').split("_")[0];
       $('#top_level_view_port').html('')
       var classes = Sem.classes[which];
       $.each(classes, function(idx, item){
         it = create_cloud_link(item);
         var right
         if (idx <= classes.length / 2){
           right = true
         } else {
           right = false;
         }
         it = position_item(it, idx, Sem.classes[which].length / 2, right);
         $('#top_level_view_port').append(it)
       })
      Sem.current_top_level = {'label': which, 'url':$(this).data('url')};
      set_currently_searching_monitor([Sem.current_top_level.label])
    });
})


function set_currently_searching_monitor(term_array){
  $('#currently_searching_top').text(term_array.join(" > "));
}

function create_cloud_link(item){
    var it = $("<span>");
    it.text(item.label);
    it.addClass("cloud_link");
    it.data('target_url', item.url);
    it.attr('id', item.label);
    //console.log(it);
    return it
}
function position_item(it, idx, len, right){
  steps = len
  idx -= len * (right ? 0.5 : 0.0)
  var skew_idx = idx * (right ? 0.9 : 0.9);
  var top = Math.sin(1.9 * Math.PI / (len * 2.5) * skew_idx)
  var left = Math.cos(1.9 * Math.PI / (len * 2.5) * skew_idx)
  var css = {'top': top * Sem.cloud.y_stretch  + 190,
             'left': left * Sem.cloud.x_stretch  + 300}
  it.css(css)
  return it
}

(function($, window, undefined) {
    //patch ajax settings to call a progress callback
    var oldXHR = $.ajaxSettings.xhr;
    $.ajaxSettings.xhr = function() {
        var xhr = oldXHR();
        if(xhr instanceof window.XMLHttpRequest) {
            xhr.addEventListener('progress', this.progress, false);
        }
        
        if(xhr.upload) {
            xhr.upload.addEventListener('progress', this.progress, false);
        }
        
        return xhr;
    };
})(jQuery, window);
