(function (proto) {
    proto.transport = {};
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
    function sendQuery(url, successCallback, options) {
        options = options || {};
        var lastAjax,
            ajaxSetup = {
            dataType: "json",
            url: url,
            success: successCallback
        };
        if (options.completeCallback) {
            ajaxSetup.complete = function () {
                options.completeCallback();
            };
        }
        if (options.errorCallback) {
            ajaxSetup.error = options.errorCallback;
        }
        if (options.trackLoading) {
            ajaxSetup.progress = options.trackLoading;
        }
        var req = new XMLHttpRequest();
        req.open("GET", ajaxSetup.url, true);
        req.onreadystatechange = function () {
            if (req.readyState !== 4 || req.status !== 200) {
                return;
            } else {
                var data = (JSON.parse(req.responseText));
                ajaxSetup.success(data);
            }
            ajaxSetup.complete();
        };
        req.send();
        proto.transport.currentAjax = lastAjax;
        return lastAjax;
    }
    proto.transport._sendQuery = sendQuery;
})(L.DBpediaLayer.prototype);
