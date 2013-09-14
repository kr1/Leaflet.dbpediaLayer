/**
 * What to test:
 * - the plugin gets attached via a layerGroup.
 * - the plugin adds functionality for transport and queries.
 * - the plugin attaches a callback to moveend-event.
 * - the plugin should query DBpedia on moveend-event.
 * - the plugin correctly handles preferences assembly.
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

    describe("assembles the preferences object, which", function () {
        it("should get created during initialization", function () {
            expect(lay.dbp.prefs).toBeDefined();
        });
        describe("should have the published defaults:", function () {
            beforeEach(function () {
                reinitializeMap(map, {});
            });
            var prefKeys = [["displayThumbnail", true], ["displayPosition", true], ["displayTypes", true],
                              ["displayAbstract", true], ["displayLink", true], ["includeCities", false],
                              ["displayMarkerLabel", true], ['lang', "en"]];
            for (var key in prefKeys) {
                it(prefKeys[key][0] + ": " + prefKeys[key][1], function () {
                    expect(lay.dbp.prefs[prefKeys[key][0]]).toBe(prefKeys[key][1]);
                });
            }
        });
        describe("should reflect initialization options", function () {
            it("e.g. should accept lang", function () {
                reinitializeMap(map, {lang: 'it'});
                expect(lay.dbp.prefs.lang).toEqual("it");
            })
            it("and should accept displayThumbnail", function () {
                reinitializeMap(map, {displayThumbnail: false});
                expect(lay.dbp.prefs.displayThumbnail).toEqual(false);
            })
            it("and should understand loaderGif", function () {
                expect(lay.dbp.prefs.loaderGif).toEqual(null);
                lay.dbp.loaderGif = undefined;
                reinitializeMap(map, {loaderGif: "http://ex/static/loader.gif"});
                expect(lay.dbp.prefs.loaderGif).toEqual("http://ex/static/loader.gif");
                lay.dbp._putLoader();
                expect(lay.dbp.loaderGif.src).toEqual("http://ex/static/loader.gif");
            })
            it("and should understand icon", function () {
                expect(lay.dbp.prefs.icon).toEqual(null);
                reinitializeMap(map, {icon: {iconURL: "http://ex/static/loader.gif"}});
                expect(lay.dbp.prefs.icon.iconURL).toEqual("http://ex/static/loader.gif");
                expect(lay.dbp.icon instanceof L.Icon).toBe(true);
            });
            it("and should create an icon", function () {
                expect(lay.dbp.icon instanceof L.Icon).toBe(true);
                reinitializeMap(map, {icon: {iconUrl: "http://ex/static/loader.gif"}});
                expect(lay.dbp.icon.options.iconUrl).toBe("http://ex/static/loader.gif");
            });
            it("and should accept complete icon info", function () {
                reinitializeMap(map, {
                    icon: {
                        iconUrl: '/javascripts/images/face.png',
                        iconSize: [32, 40],
                        iconAnchor: [16, 35],
                        popupAnchor: [0, -28]
                    },
                    displayMarkerLabel: false}
                );
                expect(function () {lay.dbp._addDBpediaLayer(exampleParsedDBpediaResponse)}).not.toThrow();
            })
        });
    });
});

