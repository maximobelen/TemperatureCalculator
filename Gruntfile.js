var to5 = require('6to5-browserify');
var babelify = require('babelify');
var envify = require('envify/custom');

module.exports = function(grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({

        // configurable paths
        config: {
            src: 'src',
            dist: 'dist',
            tmp: '.tmp',
            vendor: '<%= bowerrc.directory %>',
            node: 'node_modules'
        },

        // Metadata
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= props.license %> */\n',

        watch: {
            less: {
                files: ['<%= config.src %>/less/**/*.less'],
                tasks: ['less_imports', 'less:dev'],
                options: {
                  interrupt: false
                }
            }
        },

        less: {
            dev: {
                files: {
                    '<%= config.tmp %>/main.css': "<%= config.src %>/less/main.less"
                }
            },
            dist: {
                options: {
                    compress: true
                },
                files: {
                    '<%= config.dist %>/main.css': "<%= config.src %>/less/main.less"
                }
            },
        },

        less_imports: {
            options: {
                inlineCSS: false, // default: true
                import: 'less' // default: once
            },
            dev: {
                files: {'<%= config.src %>/less/_imports.less': ['<%= config.src %>/less/ui/**/*.less', '<%= config.src %>/less/sections/**/*.less']}
            }
        },

        browserify: {
            options: {
                transform: [to5.configure({only:/.*\.es6/}), 'hbsfy'],
                browserifyOptions: {
                    debug: true,
                    extensions: ['.es6']
                }
            },
            dev: {
                options: {
                    watch: true,
                    keepAlive: true,
                    debug: true,
                    extensions: ['.es6']
                },
                files: {
                    '<%= config.tmp %>/main.js': ['<%= config.src %>/js/main.js']
                }
            },
            
            dist: {
                options: {
                    watch: false,
                    transform: [envify({
                        NODE_ENV: 'production'
                    }), babelify.configure({
                        extensions: ['.es6']
                    }), 'hbsfy'],
                    keepAlive: false,
                    browserifyOptions: {
                        debug: false,
                        extensions: ['.es6']
                    }
                },
                files: {
                    '<%= config.dist %>/main.js': ['<%= config.src %>/js/main.js']
                }
            }
        },
        copy: {
            dist: {
                files: [
                    // includes files within path
                    //{expand: true, cwd: 'cms/', src: ['archive/*', 'exports/*', 'cockpit/storage/cache/thumbs/*'], dest: '<%= config.dist %>/cms/'},

                    // includes files within path and its sub-directories
                    {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['images/**'],
                        dest: '<%= config.dist %>/'
                    }, {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['assets/**'],
                        dest: '<%= config.dist %>/'
                    }, {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['videos/**'],
                        dest: '<%= config.dist %>/'
                    }, {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['sprites/**'],
                        dest: '<%= config.dist %>/'
                    }, {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['webfonts/**'],
                        dest: '<%= config.dist %>/'
                    },

                    {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['*.html'],
                        dest: '<%= config.dist %>/'
                    },

                    {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['index.php', 'og.php'],
                        dest: '<%= config.dist %>/'
                    },

                    {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['test.php'],
                        dest: '<%= config.dist %>/'
                    },
                    
                    // PHP
                    {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['php/*.php'],
                        dest: '<%= config.dist %>/'
                    },

                    // libs
                    {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['js/lib/mobile-detect/mobile-detect.min.js', 'js/lib/domready/ready.min.js'],
                        dest: '<%= config.dist %>/'
                    },

                    // sitemap
                    {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['sitemap.xml'],
                        dest: '<%= config.dist %>/'
                    }

                    // makes all src relative to cwd
                    //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
                    //
                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
                    //
                ],
            },
        },

        clean: {
            dist: ['dist']
        },

        uglify: {
            options: {
                mangle: false
            },
            dist: {
                options: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                },
                files: {
                    '<%= config.dist %>/main.js': ['<%= config.dist %>/main.max.js'],
                    '<%= config.dist %>/main_mobile.js': ['<%= config.dist %>/main_mobile.max.js']
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 9001,
                    keepalive: true,
                    useAvailablePort: true,
                    base: ['.tmp', 'src']
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['watch', 'browserify:dev', 'connect'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-less-imports');

    // Default task
    grunt.registerTask('default', ['less_imports:dev', 'less:dev', 'concurrent:dev']);
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'browserify:dist', 'less:dist']);


};