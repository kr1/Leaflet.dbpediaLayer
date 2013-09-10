/*
build and test and scripts.

To use, install Node, then run the following commands in the project root:

    npm install -g jake
    npm install

To check the code for errors and build Leaflet from source, run "jake".
To run the tests, run "jake test".

*/

var build = require('./build/build.js');

desc('Check Leaflet source for errors with JSHint');
task('lint', build.lint);

desc('Combine and compress Leaflet source files');
task('build', ['lint'], build.build);

task('default', ['build']);
