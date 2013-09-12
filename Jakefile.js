/*
build and test and scripts.

To use, install Node, then run the following commands in the project root:

    npm install -g jake
    npm install

To check the code for errors and build Leaflet from source, run "jake".
To run the tests, run "jake test".

*/

var build = require('./build/build.js');

desc('Check sources for errors with JSHint');
task('lint', build.lint);

desc('Combine and compress source files');
task('build', ['lint'], build.build);

desc('run all tests in spec folder');
task('test', [], build.test);

desc('run unit tests in spec/unit folder');
task('unit', [], build.runUnitTests);

desc('run functional tests in spec/functional folder');
task('functional', [], build.runFunctionalTests);

task('default', ['build']);
