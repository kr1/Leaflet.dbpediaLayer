/* global map, lay */
/**
 * What to test:
 * - current map bounds are queried
 */

describe("query assembly", function () {
    it("should query for the current bounds", function () {
        reinitializeMap(map);
        var curBounds = map.getBounds();
        console.log(Object.keys(curBounds));
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

