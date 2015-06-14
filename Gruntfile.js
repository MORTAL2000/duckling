module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jade');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            duckling: {
                src: ['src/ts/**/*.ts'],
                dest: 'build/scripts/duckling.js',
                options: {
                    module: 'amd',
                    target: 'es5'
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            jsdepend: {
                src: [
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/rivets/node_modules/sightglass/index.js',
                    'node_modules/rivets/dist/rivets.js',
                    'node_modules/bootstrap/dist/js/bootstrap.js',
                    'node_modules/jade/runtime.js'
                ],
                dest: 'build/dependencies/dependencies.js'
            },
            cssdepend: {
                src: ['node_modules/bootstrap/dist/css/bootstrap.css'],
                dest: 'build/dependencies/dependencies.css'
            },
            css: {
                src: ['src/css/**/*.css'],
                dest: 'build/styles/duckling.css'
            }
        },
        sass: {
            duckling: {
                files: [{
                    expand: true,
                    src: ['srs/sass/main.sass'],
                    dest: 'build/styles/duckling.css'
                }]
            }
        },
        copy: {
            package: {
                files: [
                    {expand: true, src: 'package.json', dest: 'build'}
                ]
            }
        },
        jade: {
            index: {
                files: {
                    "build/index.html" : ["src/index.jade"]
                }
            },
            views: {
                options: {
                    client: "true",
                    namespace: "views.templates",
                    processName: function(filename) {
                        return filename.slice("src/jade/".length,-".jade".length);
                    }
                },
                files: {
                    "build/scripts/duckling_views.js" : ["src/jade/**/*.jade"]
                }
            }
        }
    });

    grunt.registerTask('default', ['typescript','concat','copy','jade']);
}
