/**
 * What to test:
 * - the plugin gets attached via a layerGroup.
 * - the plugin adds functionality for transport and queries.
 * - the plugin attaches a callback to moveend-event.
 * - the plugin should query DBpedia on moveend-event.
 */

describe("the layer setup", function () {
    beforeEach(function () {
    })

    it("should create a layerGroup", function () {
        initializeMap();
        expect(lay instanceof L.LayerGroup).toBe(true);
    });

    it("should attach functionality for transport", function () {
        expect(lay.dbp.transport).toBeDefined();
    });

    it("should attach functionality for queries", function () {
        expect(lay.dbp.queries).toBeDefined();
    });

    it("should attach an event to moveend", function () {
        spyOn(map, 'on').andCallThrough();
        lay = L.dbPediaLayer(map);
        expect(map.on).toHaveBeenCalled();
    });

    it("should query DBpedia on *moveend*-event", function () {
        map = reinitializeMap(map);
        spyOn(lay.dbp, "_ajaxWrapper").andCallThrough();
        spyOn(lay.dbp.transport, "_sendQuery");
        map.fireEvent("moveend");
        expect(lay.dbp._ajaxWrapper).toHaveBeenCalled();
        expect(lay.dbp.transport._sendQuery).toHaveBeenCalled();
    });
});

