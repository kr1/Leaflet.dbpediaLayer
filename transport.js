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
                exports._removeLoader();
                options.completeCallback();
            };
        };
        if (options.errorCallback){
            ajaxSetup.error = options.errorCallback;
        };
        if (options.trackLoading){
            ajaxSetup.progress = options.trackLoading;
        };
        exports._putLoader();
        lastAjax = $.ajax(ajaxSetup);
        exports.currentAjax = lastAjax;
        return lastAjax;
    }
    exports._sendQuery = sendQuery;
    exports._putLoader = function(){
        if (typeof L.DBPediaLayer.loaderGif === 'undefined'){
            var gif = $('<img>');
            gif.attr('src', './javascripts/dbp/dbpedia_anim.gif')
               .css({'position':'absolute',
                     'width':64,
                     'top':'15px',
                     'left': '48%'});
            L.DBPediaLayer.loaderGif = gif;
            L.DBPediaLayer.jMap.append(gif);
        } else {
            L.DBPediaLayer.loaderGif.show();
        }
    }
    exports._removeLoader = function(){
        L.DBPediaLayer.loaderGif.hide();
    }
})(L.DBPediaLayer.prototype.transport = {})
