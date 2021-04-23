module.exports = function(grunt){
	// configurations
    grunt.initConfig({
		concat: {
			options: {
			  separator: '',
			},
			html: {
				src: ['components/html/head.html', 'components/html/nav.html', 'components/html/map.html', 'components/html/panels.html', 'components/html/footer.html'],
				dest: 'components/html/combined/index.html'
		  	},
			css: {
				src: ['components/css/general.css', 'components/css/loader.css','components/css/modals.css','components/css/nav.css', 'components/css/map-controls.css', 'components/css/popup.css', 'components/css/media-query.css' ],
				dest: 'components/css/combined/style.css'
			 },
			js: {
				src: ['components/js/functions.js', 'components/js/map-functions.js', 'components/js/date-picker.js', 'components/js/map.js',  'components/js/layers.js', 'components/js/search.js', 'components/js/geolocate.js','components/js/loading-screen.js'],
				dest: 'components/js/combined/app.js'
			}
		},
		htmlmin: {
			dist: {
			  options: {
				removeComments: true,
				collapseWhitespace: true
			  },
			  files: {
				'build/index.html': 'components/html/combined/index.html'
				}
			}
		},
		cssmin: {
          options: {
              sourceMap: true
          },
		  target: {
			files: [{
			  expand: true,
			  cwd: 'components/css/combined',
			  src: ['*.css'],
			  dest: 'build/assets/css',
			  ext: '.min.css'
			}]
		  }
	    },
		uglify: {
			options: {
				mangle: false,
				sourceMap: true,
        		sourceMapName: 'build/assets/js/app.map'
			},
			my_target: {
			  files: {
				'build/assets/js/app.min.js' : ['components/js/combined/app.js']
			  }
			}
  		},
		watch: {
			html: {
				files: 'components/html/*.html',
				tasks: ['concat:html','htmlmin']
			},
			css: {
				files: 'components/css/*.css',
				tasks: ['concat:css','cssmin']
			},
			js: {
				files: 'components/js/*.js',
				tasks: ['concat:js','uglify']
			}
		},
        connect: {
			server: {
			  options: {
				base: 'build'
			  }
			}
  		}
	});
    // load tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
    // register tasks
	grunt.registerTask('default', ['connect','watch']);
};