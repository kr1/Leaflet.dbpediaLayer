var utils = require("./../../src/utils.js");
describe("the utils' overlapping detection", function () {
    it("should recognize overlapping by shifting in one direction", function () {
        var left = {SW: {lat: 0, lng: 0}, NE: {lat: 10, lng: 10}};
        var right = {SW: {lat: 1, lng: 1}, NE: {lat: 11, lng: 11}};
        expect(utils._overlapping(left, right)).toBe(true);
    });
    it("should recognize overlapping by shifting in the opposite direction", function () {
        var right = {SW: {lat: 0, lng: 0}, NE: {lat: 10, lng: 10}};
        var left = {SW: {lat: -1, lng: -1}, NE: {lat: 8, lng: 7}};
        expect(utils._overlapping(left, right)).toBe(true);
    });
    it("should recognize overlapping by zooming out", function () {
        var smaller = {SW: {lat: 0, lng: 0}, NE: {lat: 10, lng: 10}};
        var bigger = {SW: {lat: -10, lng: -10}, NE: {lat: 20, lng: 20}};
        expect(utils._overlapping(smaller, bigger)).toBe(true);
    });
    it("should recognize overlapping by zooming in", function () {
        var bigger = {SW: {lat: 0, lng: 0}, NE: {lat: 10, lng: 10}};
        var smaller = {SW: {lat: 4, lng: 4}, NE: {lat: 9, lng: 9}};
        expect(utils._overlapping(smaller, bigger)).toBe(true);
    });
    it("should recognize non-overlapping areas", function () {
        var bigger = {SW: {lat: 0, lng: 0}, NE: {lat: 10, lng: 10}};
        var smaller = {SW: {lat: 14, lng: 0}, NE: {lat: 19, lng: 19}};
        expect(utils._overlapping(smaller, bigger)).toBe(false);
    });
});

describe("the utils' multiple overlay comparison (_identifyAreaToLoad)", function () {
    describe("by comparing areas", function () {
        var first = {SW: {lat: 0, lng: 0}, NE: {lat: 10, lng: 10}};
        var second = {SW: {lat: 1, lng: 1}, NE: {lat: 11, lng: 11}};
        var third = {SW: {lat: 2, lng: 2}, NE: {lat: 12, lng: 12}};
        var thirdOut = {SW: {lat: -200, lng: -200}, NE: {lat: -12, lng: -12}};
        var fourth = {SW: {lat: 1.6, lng: 1.6}, NE: {lat: 6, lng: 6}};
        var fifthOut = {SW: {lat: 16, lng: 16}, NE: {lat: 20, lng: 20}};
        it("should recognize a simple overlay", function () {
            var res1 = utils._identifyAreaToLoad(second, [first]);
            expect(res1).toEqual({current: second, not: [first]});
        });
        it("should recognize multiple overlays", function () {
            var res2 = utils._identifyAreaToLoad(third, [first, second]);
            expect(res2).toEqual({current: third, not: [first, second]});
            var res3 = utils._identifyAreaToLoad(fourth, [first, second, third]);
            expect(res3).toEqual({current: fourth, not: [first, second, third]});
        });
        it("should recognize non-overlaying members", function () {
            var res4 = utils._identifyAreaToLoad(fifthOut, [first, second, third, fourth]);
            expect(res4).toEqual({current: fifthOut, not: []});
            var res5 = utils._identifyAreaToLoad(fourth, [first, second, thirdOut]);
            expect(res5).toEqual({current: fourth, not: [first, second]});
        });
    });
});
