module.exports = function(config) {
    config.set({
        singleRun: true,
        basePath: '../../',
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        files: [
            'dev/test/js/globals.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/chai/chai.js',
            'bower_components/sinon/lib/sinon.js',
            'bower_components/sinon-chai/lib/sinon-chai.js',
            'dev/test/js/jasmine/**/*.js',
            'dev/src/**/*.js'
        ]
    });
};
