/* eslint-disable camelcase */
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    const jsAppFiles = '_src/app/**/*.js';
    const otherFiles = [
        '_src/app/**/*.html',
        '_src/index.html',
        '_src/ChangeLog.html'
    ];
    const gruntFile = 'Gruntfile.js';
    const jsFiles = [
        jsAppFiles,
        gruntFile,
        'profiles/*.js'
    ];
    const bumpFiles = [
        'bower.json',
        '_src/app/package.json',
        '_src/app/config.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env'],
                plugins: ['transform-es2015-modules-simple-amd']
            },
            src: {
                files: [{
                    expand: true,
                    cwd: '_src/app/',
                    src: ['**/*.js'],
                    dest: 'src/app/'
                }]
            }
        },
        bump: {
            options: {
                files: bumpFiles,
                push: false,
                commit: false,
                createTag: false
            }
        },
        cachebreaker: {
            main: {
                options: {
                    match: [
                        'dojo/dojo.js',
                        'app/resources/App.css'
                    ]
                },
                files: {
                    src: ['dist/*.html']
                }
            }
        },
        clean: {
            build: ['dist'],
            src: ['src/app']
        },
        connect: {
            uses_defaults: {}
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['*.html', 'web.config'],
                    dest: 'dist/'
                }]
            },
            src: {
                expand: true,
                cwd: '_src',
                src: ['**/*.html', '**/*.css', '**/*.png', '**/*.jpg', '**/*.gif', 'app/package.json'],
                dest: 'src'
            }
        },
        dojo: {
            prod: {
                options: {
                    profiles: ['profiles/prod.build.profile.js', 'profiles/build.profile.js']
                }
            },
            stage: {
                options: {
                    profiles: ['profiles/stage.build.profile.js', 'profiles/build.profile.js']
                }
            },
            options: {
                dojo: 'src/dojo/dojo.js',
                load: 'build',
                releaseDir: '../dist',
                requires: ['src/app/packages.js', 'src/app/run.js'],
                basePath: './src'
            }
        },
        eslint: {
            options: {
                overrideConfigFile: '.eslintrc'
            },
            main: {
                src: jsFiles
            }
        },
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: '_src/',
                    // exclude tests because some images in dojox throw errors
                    src: ['**/*.{png,jpg,gif}', '!**/tests/**/*.*'],
                    dest: 'src/'
                }]
            }
        },
        processhtml: {
            options: {},
            main: {
                files: {
                    'dist/index.html': ['src/index.html']
                }
            }
        },
        uglify: {
            options: {
                preserveComments: false,
                sourceMap: true,
                compress: {
                    drop_console: true,
                    passes: 2,
                    dead_code: true
                }
            },
            stage: {
                options: {
                    compress: {
                        drop_console: false
                    }
                },
                src: ['dist/dojo/dojo.js'],
                dest: 'dist/dojo/dojo.js'
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['**/*.js', '!proj4/**/*.js'],
                    dest: 'dist'
                }]
            }
        },
        stylus: {
            main: {
                options: {
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: '_src/',
                    src: ['app/**/*.styl'],
                    dest: 'src/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            eslint: {
                files: jsFiles,
                tasks: ['eslint']
            },
            src: {
                files: jsFiles.concat(otherFiles),
                options: { livereload: true },
                tasks: ['newer:babel', 'newer:copy:src']
            },
            stylus: {
                files: 'src/app/**/*.styl',
                tasks: ['newer:stylus'],
                options: { livereload: true }
            }
        }
    });

    grunt.registerTask('default', [
        'eslint',
        'clean:src',
        'babel',
        'stylus',
        'copy:src',
        'connect',
        'watch'
    ]);
    grunt.registerTask('build-prod', [
        'clean',
        'babel',
        'newer:imagemin:main',
        'stylus',
        'copy:src',
        'dojo:prod',
        'uglify:prod',
        'copy:dist',
        'processhtml:main',
        'cachebreaker'
    ]);
    grunt.registerTask('build-stage', [
        'clean',
        'babel',
        'newer:imagemin:main',
        'stylus',
        'copy:src',
        'dojo:stage',
        'uglify:stage',
        'copy:dist',
        'processhtml:main',
        'cachebreaker'
    ]);
    grunt.registerTask('test', [
        'eslint'
    ]);
};
