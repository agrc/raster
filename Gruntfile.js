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
        'package.json',
        'bower.json',
        '_src/app/package.json',
        '_src/app/config.js'
    ];
    const deployFiles = [
        '**',
        '!**/*.uncompressed.js',
        '!**/*consoleStripped.js',
        '!**/bootstrap/less/**',
        '!**/bootstrap/test-infra/**',
        '!**/tests/**',
        '!build-report.txt',
        '!components-jasmine/**',
        '!favico.js/**',
        '!jasmine-favicon-reporter/**',
        '!jasmine-jsreporter/**',
        '!stubmodule/**',
        '!util/**'
    ];
    const deployDir = 'wwwroot/raster';
    let secrets;
    try {
        secrets = grunt.file.readJSON('secrets.json');
    } catch (e) {
        // swallow for build server
        secrets = {
            stageHost: '',
            prodHost: '',
            username: '',
            password: ''
        };
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                sourceMap: true,
                presets: [['@babel/preset-env', {
                    useBuiltIns: false,
                    modules: false
                }]],
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
                commitFiles: bumpFiles.concat(['src/ChangeLog.html']),
                push: false
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
            deploy: ['deploy'],
            src: ['src/app']
        },
        compress: {
            main: {
                options: {
                    archive: 'deploy/deploy.zip'
                },
                files: [{
                    src: deployFiles,
                    dest: './',
                    cwd: 'dist/',
                    expand: true
                }]
            }
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
                src: ['**/*.html', '**/*.css', '**/*.png', '**/*.jpg', '**/*.gif', 'secrets.json', 'app/package.json'],
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
                configFile: '.eslintrc'
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
        secrets: secrets,
        sftp: {
            stage: {
                files: {
                    './': 'deploy/deploy.zip'
                },
                options: {
                    host: '<%= secrets.stageHost %>'
                }
            },
            prod: {
                files: {
                    './': 'deploy/deploy.zip'
                },
                options: {
                    host: '<%= secrets.prodHost %>'
                }
            },
            options: {
                path: './' + deployDir + '/',
                srcBasePath: 'deploy/',
                username: '<%= secrets.username %>',
                password: '<%= secrets.password %>',
                showProgress: true
            }
        },
        sshexec: {
            options: {
                username: '<%= secrets.username %>',
                password: '<%= secrets.password %>'
            },
            stage: {
                command: ['cd ' + deployDir, 'unzip -oq deploy.zip', 'rm deploy.zip'].join(';'),
                options: {
                    host: '<%= secrets.stageHost %>'
                }
            },
            prod: {
                command: ['cd ' + deployDir, 'unzip -oq deploy.zip', 'rm deploy.zip'].join(';'),
                options: {
                    host: '<%= secrets.prodHost %>'
                }
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
    grunt.registerTask('deploy-prod', [
        'clean:deploy',
        'compress:main',
        'sftp:prod',
        'sshexec:prod'
    ]);
    grunt.registerTask('deploy-stage', [
        'clean:deploy',
        'compress:main',
        'sftp:stage',
        'sshexec:stage'
    ]);
    grunt.registerTask('travis', [
        'eslint'
    ]);
};
