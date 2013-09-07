(function(exports){
    function send_query(url, successCallback, options){
        // options:
        // - track_loading -> function, to visualize query progress
        // - errorCallback -> function
        options = options || {};
        set_progress_value(2, "request sent...");
        var ajaxSetup = {
          dataType: "json",
          url: url,
          success: successCallback,
        }
        if (options.errorCallback){
            ajaxSetup.error = options.errorCallback
        }
        if (options.track_loading){
          // ajaxSetup.progress = onUpdateProgress
          ajaxSetup.progress = options.track_loading
        }
        exports.putLoader();
        var lastAjax = $.ajax(ajaxSetup);
        if (options.track_loading){ // i.e. if the call is for content, not for count
          exports.currentAjax = lastAjax;
        }
        return lastAjax;
    }
    exports.send_query = send_query;
    exports.putLoader = function(){
        if (typeof dbpLayer.loaderGif === 'undefined'){
            var gif = $('<img>');
            gif.attr('src', './javascripts/dbp/dbpedia_anim.gif').
              css({'position':'absolute',
                   'width':64,
                   'top':'15px',
                   'left': '48%'});
            dbpLayer.loaderGif = gif;
            dbpLayer.jMap.append(gif);
        } else {
            dbpLayer.loaderGif.show();
        }
    }
    exports.removeLoader = function(){
        dbpLayer.loaderGif.hide();
    }
})(typeof exports === 'undefined' ? this['dbpLayer']['transport'] = {} : exports)
