/* global map, lay */
/**
 * What to test:
 * - current map bounds are queried
 */

describe("query assembly", function () {
    beforeEach(function () {
    })
    it("should query for the current bounds", function () {
        typeof map !== "undefined" ? reinitializeMap(map) : initializeMap();
        var curBounds = map.getBounds();
        spyOn(lay.dbp.queries, "_assembleDbpediaURL");
        map.fireEvent("moveend");
        expect(lay.dbp.queries._assembleDbpediaURL.mostRecentCall.args[0]).toMatch("lat > " + curBounds._southWest.lat);
        expect(lay.dbp.queries._assembleDbpediaURL.mostRecentCall.args[0]).toMatch("lng > " + curBounds._southWest.lng);

        map.panBy(new L.Point(500, 500))
        curBounds = map.getBounds();
        map.fireEvent("moveend");
        expect(lay.dbp.queries._assembleDbpediaURL.mostRecentCall.args[0]).toMatch("lat > " + curBounds._southWest.lat);
        expect(lay.dbp.queries._assembleDbpediaURL.mostRecentCall.args[0]).toMatch("lng > " + curBounds._southWest.lng);
    });
});

