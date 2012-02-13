var tests = require( './flow' );
var Flow  = require( '../lib/flow' );
var flow  = new Flow();



Object.keys( tests ).forEach( function( test ){
  flow.parallel( function ( ready ){
    tests[ test ]( ready );
  });
});

flow.join().end( function (){
  console.log( 'All test passed :)' );
});
