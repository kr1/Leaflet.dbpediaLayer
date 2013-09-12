/*
 Copyright:
 this build-script is based on the Leaflet build-script written by:
 [Github-accounts]: mourner, edjafarov, jfirebaugh, Felixls, chosak, tmcw
*/

var fs = require('fs'),
    jshint = require('jshint'),
    UglifyJS = require('uglify-js'),

    deps = require('./deps.js').deps,
    hintrc = require('./hintrc.js').config;

function lintFiles(files) {

    var errorsFound = 0,
        i, j, len, len2, src, errors, e;

    for (i = 0, len = files.length; i < len; i++) {

        jshint.JSHINT(fs.readFileSync(files[i], 'utf8'), hintrc, {L: true});
        errors = jshint.JSHINT.errors;

        for (j = 0, len2 = errors.length; j < len2; j++) {
            e = errors[j];
            console.log(files[i] + '\tline ' + e.line + '\tcol ' + e.character + '\t ' + e.reason);
        }

        errorsFound += len2;
    }

    return errorsFound;
}

function getFiles(compsBase32) {
    var memo = {},
        comps;

    if (compsBase32) {
        comps = parseInt(compsBase32, 32).toString(2).split('');
        console.log('Managing dependencies...');
    }

    function addFiles(srcs) {
        for (var j = 0, len = srcs.length; j < len; j++) {
            memo[srcs[j]] = true;
        }
    }

    for (var i in deps) {
        if (comps) {
            if (parseInt(comps.pop(), 2) === 1) {
                console.log('\t* ' + i);
                addFiles(deps[i].src);
            } else {
                console.log('\t  ' + i);
            }
        } else {
            addFiles(deps[i].src);
        }
    }

    var files = [];

    for (var src in memo) {
        files.push('src/' + src);
    }

    return files;
}

exports.getFiles = getFiles;

exports.lint = function () {

    var files = getFiles();

    console.log('Checking for JS errors...');

    var errorsFound = lintFiles(files);

    if (errorsFound > 0) {
        console.log(errorsFound + ' error(s) found.\naborting!\n');
        fail();
    } else {
        console.log('\tCheck passed');
    }
};

function getSizeDelta(newContent, oldContent) {
    if (!oldContent) {
        return 'new';
    }
    var newLen = newContent.replace(/\r\n?/g, '\n').length,
        oldLen = oldContent.replace(/\r\n?/g, '\n').length,
        delta = newLen - oldLen;

    return (delta >= 0 ? '+' : '') + delta;
}

function loadSilently(path) {
    try {
        return fs.readFileSync(path, 'utf8');
    } catch (e) {
        return null;
    }
}

function combineFiles(files) {
    var content = '';
    for (var i = 0, len = files.length; i < len; i++) {
        content += fs.readFileSync(files[i], 'utf8') + '\n\n';
    }
    return content;
}

exports.build = function (compsBase32, buildName) {

    var files = getFiles(compsBase32);

    console.log('Concatenating ' + files.length + ' files...');

    var copy = fs.readFileSync('src/copyright.js', 'utf8'),
        intro = '(function (window, document, undefined) {',
        outro = '}(window, document));',
        newSrc = copy + intro + combineFiles(files) + outro,

        pathPart = 'dist/leaflet.dbpedialayer' + (buildName ? '-' + buildName : ''),
        srcPath = pathPart + '-src.js',

        oldSrc = loadSilently(srcPath),
        srcDelta = getSizeDelta(newSrc, oldSrc);

    console.log('\tUncompressed size: ' + newSrc.length + ' bytes (' + srcDelta + ')');

    if (newSrc === oldSrc) {
        console.log('\tNo changes');
    } else {
        fs.writeFileSync(srcPath, newSrc);
        console.log('\tSaved to ' + srcPath);
    }

    console.log('Compressing...');

    var path = pathPart + '.js',
        oldCompressed = loadSilently(path),
        newCompressed = copy + UglifyJS.minify(newSrc, {
            warnings: true,
            fromString: true
        }).code,
        delta = getSizeDelta(newCompressed, oldCompressed);

    console.log('\tCompressed size: ' + newCompressed.length + ' bytes (' + delta + ')');

    if (newCompressed === oldCompressed) {
        console.log('\tNo changes');
    } else {
        fs.writeFileSync(path, newCompressed);
        console.log('\tSaved to ' + path);
    }
};

function logToConsole(data) {
    console.log(String(data));
}

exports.test = function () {
    exports.runUnitTests();
    exports.runFunctionalTests();
}

exports.runFunctionalTests = function () {
    var spawn = require('child_process').spawn,
        args = ["node_modules/phantom-jasmine/lib/run_jasmine_test.coffee", "spec/functional/TestRunner.html"],
        phantom = spawn("phantomjs", args);
    phantom.stdout.on('data', logToConsole);
    phantom.stderr.on('data', logToConsole);

    phantom.on('exit', function(exitCode) {
        console.log("finished")
    });
}

exports.runUnitTests = function () {
    // util that spawns a child process
    var spawn = require('child_process').spawn;

    // on server ready launch the jasmine-node process with your test file
    var jasmineNode = spawn('node_modules/.bin/jasmine-node', ['spec/unit/']);

    jasmineNode.stdout.on('data', logToConsole);
    jasmineNode.stderr.on('data', logToConsole);

    jasmineNode.on('exit', function(exitCode) {
        // when jasmine-node is done, shuts down the application server
        console.log("finished")
    });
}
