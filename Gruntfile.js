'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/'],
            temp: ['temp/']
        },
        copy: {
            build: {
                cwd: 'temp/',
                dest: 'build/',
                expand: true,
                src: ['ngFacebook.min.js']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'dev/src/js/**/*.js'],
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                evil: true,
                forin: true,
                globalstrict: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                trailing: true,
                undef: true,
                unused: true,

                camelcase: true,
                indent: 4,
                quotmark: 'single',

                globals: {
                    // Angular
                    angular: false,

                    // Grunt
                    module: false,

                    // Facebook
                    FB: false,

                    // document
                    document: false
                }
            }
        },
        karma: {
            jasmine: {
                configFile: 'dev/test/jasmine.conf.js'
            }
        },
        strip: {
            all: {
                src: 'temp/**/*.js',
                options: {
                    inline: true
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['dev/src/unmin/**/*.js'],
                dest: 'temp/ngFacebook.js'
            }
        },
        uglify: {
            src: {
                files: {
                    'temp/ngFacebook.min.js': ['temp/ngFacebook.js']
                }
            }
        },
        watch: {
            unit: {
                files: ['Gruntfile.js', 'dev/**/*.*'],
                tasks: ['jshint', 'karma:jasmine']
            },
            hint: {
                files: ['Gruntfile.js', 'dev/**/*.*'],
                tasks: ['jshint']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-strip');

    grunt.registerTask('test', ['jshint', 'karma:jasmine']);
    grunt.registerTask('build', ['clean:temp', 'strip', 'concat', 'uglify:src', 'clean:build', 'copy:build', 'clean:temp']);
    grunt.registerTask('default', ['watch:unit']);
};