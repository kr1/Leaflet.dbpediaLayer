
var deps = {
    DBpediaLayer: {
        src: ['dbpedia_layer.js'],
        desc: 'the main file',
        heading: 'Main'
    },
    Helpers: {
        src: ['queries.js',
              'utils.js',
              'dbpedia_anim_base64.js',
              'transport.js'],
        desc: 'the helpers',
        heading: 'Helpers'
    },
}
if (typeof exports !== 'undefined') {
    exports.deps = deps;
}
