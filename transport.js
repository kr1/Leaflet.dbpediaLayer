(function(exports){
    /**
     * sendQuery() sends an ajax call. it accepts the following params
     * @param {string} url
     * @param {function} successCallback
     * @param {object} options:
     *                     - trackLoading -> function, to visualize query progress
     *                     - errorCallback -> function
     *                     - completeCallback -> function
     * @returns {number} lastAjax
     */
    function sendQuery(url, successCallback, options){
        options || (options = {});
        var lastAjax
        var ajaxSetup = {
            dataType: "json",
            url: url,
            success: successCallback
        };
        if (options.completeCallback){
            ajaxSetup.complete = function(){
                exports.removeLoader();
                options.completeCallback();
            };
        };
        if (options.errorCallback){
            ajaxSetup.error = options.errorCallback;
        };
        if (options.trackLoading){
            ajaxSetup.progress = options.trackLoading;
        };
        exports.putLoader();
        lastAjax = $.ajax(ajaxSetup);
        exports.currentAjax = lastAjax;
        return lastAjax;
    }
    exports.sendQuery = sendQuery;
    exports.putLoader = function(){
        if (typeof dbpLayer.loaderGif === 'undefined'){
            var gif = $('<img>');
            gif.attr('src', './javascripts/dbp/dbpedia_anim.gif')
               .css({'position':'absolute',
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
