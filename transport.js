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

        var lastAjax = $.ajax(ajaxSetup);
        if (options.track_loading){ // i.e. if the call is for content, not for count
          exports.currentAjax = lastAjax;
        }
    }
    exports.send_query = send_query;
})(typeof exports === 'undefined' : this['dbpediaTransport'] = {} : exports}
