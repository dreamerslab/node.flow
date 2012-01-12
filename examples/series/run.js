var Flow = require( '../../lib/flow' );
var flow = new Flow( 5, 6, 7 );



flow.series( function ( x, y, z, next ){
  // simulates a time consuming io operation
  setTimeout( function (){
    console.log( 'first task ---------------' );
    // default value of x is 5, now is overwritten to 7
    console.log( 'x : ' + x );
    console.log( 'y : ' + y );
    console.log( 'z : ' + z + '\n' );
    next( 11 );
  }, 200 );
}, 7 ).series( function ( x, y, z, next ){
  setTimeout( function (){
    console.log( 'second task ---------------' );
    // default value of x is 5, and was overwritten to 9
    // but finally is overwritten from previous stack `next` to 11
    console.log( 'x : ' + x );
    console.log( 'y : ' + y );
    console.log( 'z : ' + z + '\n' );
    next( 1000 );
  }, 100 );
}, 9, 10, 55 ).end( function ( x ){
  setTimeout( function (){
    console.log( 'all finished callback ---------------' );
    console.log( 'x : ' + x + '\n' );
  }, 150 );
});
