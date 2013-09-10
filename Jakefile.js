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

desc('run tests in spec folder');
task('test', ['lint', 'build'], build.test);

task('default', ['build']);
