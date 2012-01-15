var fs     = require( 'fs' );
var path   = require( 'path' );
var packer = require( 'node.packer' );
var rmdir  = require( 'rmdirr' );
var Flow   = require( '../../lib/flow' );

var css = {
  lib : [ 'reset', 'reset-html5' ],
  common : [ 'base', 'header', 'footer' ]
};

var js = {
  lib : [ 'dojo', 'jquery', 'prototype' ],
  app : [ 'models', 'views', 'actions' ]
};

var target_dir = __dirname + '/assets/';
var src_dir    = __dirname + '/src/';

var build = function ( flow, packer, assets, type, target_dir, src_dir ){
  var group, input;

  for( group in assets ){
    // building input files
    input = [];
    assets[ group ].forEach( function ( asset ){
      input.push( src_dir + asset + '.' + type ) ;
    });

    flow.parallel( function ( arg, ready ){
      arg.callback = function ( err, stdout, stderr ){
        if( err ) throw err;
        ready();
      };

      packer( arg );
    }, {
      input : input,
      output : target_dir + group + '.' + type,
      type : type
    });
  }
};



var flow = new Flow({
  log : true,
  minify : true,
  uglify : false
});

// check if the dir exist, if it does remove it
flow.series( function ( args, next ){
  if( path.existsSync( target_dir )){
    rmdir( target_dir, function ( err, dirs, files ){
      if( err ) throw err;
      next();
    });
  }else{
    next();
  }
}).

// create assets dir
series( function ( args, next ){
  fs.mkdirSync( target_dir );
  next();
});

// build assets
build( flow, packer, css, 'css', target_dir, src_dir );
build( flow, packer, js, 'js', target_dir, src_dir );

flow.join().end( function (){
  console.log( 'All done, go checkout the assets folder :)' );
});
