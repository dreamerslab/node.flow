var Flow = require( '../../lib/flow' );
var flow = new Flow( 5, 6, 7 );



flow.parallel( function ( x, y, z, ready ){
  // simulates a time consuming io operation
  setTimeout( function (){
    console.log( 'first task ---------------' );
    // default value of x is 5, now is overwritten to 7
    console.log( 'x : ' + x );
    console.log( 'y : ' + y );
    console.log( 'z : ' + z + '\n' );
    ready( 11, 12 );
  }, 200 );
}, 7 ).

parallel( function ( x, y, z, ready ){
  setTimeout( function (){
    console.log( 'second task ---------------' );
    // default value of x is 5, and was overwritten to 9
    // but finally is overwritten from previous stack `next` to 11
    console.log( 'x : ' + x );
    console.log( 'y : ' + y );
    console.log( 'z : ' + z + '\n' );
    ready( 1000 );
  }, 100 );
}, 9, 10, 55 ).

join().

end( function ( from_parallel, x, y, z ){
  setTimeout( function (){
    console.log( 'all finished callback ---------------' );
    console.log( 'from_parallel : ' + JSON.stringify( from_parallel ));
    console.log( 'x : ' + x );
    console.log( 'y : ' + y );
    console.log( 'z : ' + z + '\n' );
  }, 150 );
}, 700 );
