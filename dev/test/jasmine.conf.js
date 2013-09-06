module.exports = function(config) {
    config.set({
        singleRun: true,
        basePath: '../',
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        files: [
            'test/js/angular.js',
            'test/js/angular-mocks.js',
            'test/js/jasmine/**/*.js',
            'src/**/*.js'
        ]
    });
};
