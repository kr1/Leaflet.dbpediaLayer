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
        lay = L.dbPediaLayer().addTo(map);
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

    describe("the preferences object", function () {
        it("should get created during initialization", function () {
            expect(lay.dbp.prefs).toBeDefined();
        });
        describe("should have the published defaults:", function () {
            beforeEach(function () {
                reinitializeMap(map, {});
            });
            var prefKeys = [["displayThumbnail", true], ["displayPosition", true], ["displayTypes", true],
                              ["displayAbstract", true], ["displayLink", true], ["includeCities", false],
                            ['lang', "en"]];
            for (var key in prefKeys) {
                it(prefKeys[key][0] + ": " + prefKeys[key][1], function () {
                    expect(lay.dbp.prefs[prefKeys[key][0]]).toBe(prefKeys[key][1]);
                });
            }
        });
        describe("should reflect initialization options", function () {
            it("accepts lang", function () {
                reinitializeMap(map, {lang: 'it'});
                expect(lay.dbp.prefs.lang).toEqual("it");
            })
            it("accepts displayThumbnail", function () {
                reinitializeMap(map, {displayThumbnail: false});
                expect(lay.dbp.prefs.displayThumbnail).toEqual(false);
            })
        });
    });
});

