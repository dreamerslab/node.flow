var Flow   = require( '../lib/flow' );
var should = require( 'should' );

module.exports = {

  'test .version' : function ( callback ){
    Flow.version.should.match( /^\d+\.\d+\.\d+$/ );

    console.log( 'version test passed' );
    callback();
  },

  'series with default' : function ( callback ){
    var flow = new Flow( 5, 6, 7 );

    flow.series( function ( x, y, z, next ){
      setTimeout( function (){
        x.should.equal( 7 );
        y.should.equal( 6 );
        z.should.equal( 7 );
        next( 11 );
      }, 200 );
    }, 7 ).

    series( function ( x, y, z, next ){
      setTimeout( function (){
        x.should.equal( 11 );
        y.should.equal( 10 );
        z.should.equal( 55 );
        next( 1000 );
      }, 100 );
    }, 9, 10, 55 ).

    end( function ( x ){
      setTimeout( function (){
        x.should.equal( 1000 );

        console.log( 'series with default passed' );
        callback();
      }, 150 );
    });
  },

  'series without default' : function ( callback ){
    var flow = new Flow();

    flow.series( function ( x, next ){
      setTimeout( function (){
        x.should.equal( 7 );
        next( 11 );
      }, 200 );
    }, 7 ).

    series( function ( x, y, z, next ){
      setTimeout( function (){
        x.should.equal( 11 );
        y.should.equal( 10 );
        z.should.equal( 55 );
        next( 1000 );
      }, 100 );
    }, 9, 10, 55 ).

    end( function ( x ){
      setTimeout( function (){
        x.should.equal( 1000 );

        console.log( 'series without default passed' );
        callback();
      }, 150 );
    });
  },

  'parallel with default' : function ( callback ){
    var flow = new Flow( 5, 6, 7 );

    flow.parallel( function ( x, y, z, ready ){
      setTimeout( function (){
        x.should.equal( 7 );
        y.should.equal( 6 );
        z.should.equal( 7 );
        ready( 11, 12 );
      }, 200 );
    }, 7 ).

    parallel( function ( x, y, z, ready ){
      setTimeout( function (){
        x.should.equal( 9 );
        y.should.equal( 10 );
        z.should.equal( 55 );
        ready( 1000 );
      }, 100 );
    }, 9, 10, 55 ).

    join().

    end( function ( from_parallel, x, y, z, next ){
      setTimeout( function (){
        from_parallel.should.eql([{
          '0' : 1000
        }, {
          '0' : 11,
          '1' : 12
        }]);

        x.should.equal( 700 );
        y.should.equal( 6 );
        z.should.equal( 7 );

        console.log( 'parallel with default passed' );
        callback();
      }, 150 );
    }, 700 );
  },

  'parallel without default' : function ( callback ){
    var flow = new Flow();

    flow.parallel( function ( x, ready ){
      setTimeout( function (){
        x.should.equal( 7 );
        ready( 11, 12 );
      }, 200 );
    }, 7 ).

    parallel( function ( x, y, z, ready ){
      setTimeout( function (){
        x.should.equal( 9 );
        y.should.equal( 10 );
        z.should.equal( 55 );
        ready( 1000 );
      }, 100 );
    }, 9, 10, 55 ).

    join().

    end( function ( from_parallel, x, next ){
      setTimeout( function (){
        from_parallel.should.eql([{
          '0' : 1000
        }, {
          '0' : 11,
          '1' : 12
        }]);

        x.should.equal( 700 );

        console.log( 'parallel without default passed' );
        callback();
      }, 150 );
    }, 700 );
  },

  'mixed with default' : function ( callback ){
    var flow = new Flow( 5, 6, 7 );

    flow.series( function ( x, y, z, next ){
      setTimeout( function (){
        x.should.equal( 7 );
        y.should.equal( 6 );
        z.should.equal( 7 );
        next( 11 );
      }, 200 );
    }, 7 ).

    series( function ( x, y, z, next ){
      setTimeout( function (){
        x.should.equal( 11 );
        y.should.equal( 10 );
        z.should.equal( 55 );
        next( 1000, 57 );
      }, 100 );
    }, 9, 10, 55 ).

    parallel( function ( from_series, x, y, z, ready ){
      setTimeout( function (){
        // from series we have an obj as from_series
        from_series.should.eql({
          '0' : 1000,
          '1' : 57
        });

        x.should.equal( 88 );
        y.should.equal( 6 );
        z.should.equal( 7 );
        ready( 17, 18 );
      }, 200 );
    }, 88 ).

    parallel( function ( from_series, x, y, z, ready ){
      setTimeout( function (){
        from_series.should.eql({
          '0' : 1000,
          '1' : 57
        });

        x.should.equal( 99 );
        y.should.equal( 1110 );
        z.should.equal( 53 );
        ready( 1010 );
      }, 100 );
    }, 99, 1110, 53 ).

    parallel( function ( from_series, x, y, z, ready ){
      setTimeout( function (){
        from_series.should.eql({
          '0' : 1000,
          '1' : 57
        });

        x.should.equal( 5 );
        y.should.equal( 6 );
        z.should.equal( 7 );
        ready( 373 );
      }, 210 );
    }).

    join().

    parallel( function ( from_parallel, x, y, z, ready ){
      setTimeout( function (){
        // from parallel we have an array as from_parallel
        from_parallel.should.eql([{
          '0' : 1010
        }, {
          '0' : 17,
          '1' : 18
        }, {
          '0' : 373
        }]);

        x.should.equal( 27 );
        y.should.equal( 6 );
        z.should.equal( 7 );
        ready( 11, 12 );
      }, 200 );
    }, 27 ).

    parallel( function ( from_parallel, x, y, z, ready ){
      setTimeout( function (){
        from_parallel.should.eql([{
          '0' : 1010
        }, {
          '0' : 17,
          '1' : 18
        }, {
          '0' : 373
        }]);

        x.should.equal( 9 );
        y.should.equal( 10 );
        z.should.equal( 55 );
        ready( 1000 );
      }, 100 );
    }, 9, 10, 55 ).

    join( true ).

    series( function ( from_parallel, x, y, z, next ){
      setTimeout( function (){
        from_parallel.should.eql([{
          '0' : 1000
        }, {
          '0' : 11,
          '1' : 12
        }]);

        x.should.equal( 31 );
        y.should.equal( 72 );
        z.should.equal( 4 );

        next( 0 );
      }, 100 );
    }, 31, 72, 4 ).

    series( function ( x, y, z, next ){
      setTimeout( function (){
        x.should.equal( 0 );
        y.should.equal( 6 );
        z.should.equal( 7 );

        next( 20 );
      }, 100 );
    }).

    series( function ( x, y, z, next ){
      setTimeout( function (){
        x.should.equal( 20 );
        y.should.equal( 6 );
        z.should.equal( 7 );

        next( 70 );
      }, 100 );
    }).

    end( function ( x ){
      setTimeout( function (){
        x.should.equal( 70 );

        console.log( 'mixed with default passed' );
        callback();
      }, 150 );
    }, 700 );
  },

  'mixed without default' : function ( callback ){
    var flow = new Flow();

    flow.series( function ( next ){
      setTimeout( function (){
        next( 11 );
      }, 200 );
    }).

    series( function ( x, next ){
      setTimeout( function (){
        x.should.equal( 11 );
        next( 1000 );
      }, 100 );
    }).

    parallel( function ( from_series, x, ready ){
      setTimeout( function (){
        from_series.should.eql({
          '0' : 1000
        });

        x.should.equal( 7 );
        ready( 11 );
      }, 200 );
    }, 7 ).

    parallel( function ( from_series, ready ){
      setTimeout( function (){
        from_series.should.eql({
          '0' : 1000
        });

        ready();
      }, 100 );
    }).

    join().

    end( function ( from_parallel, next ){
      setTimeout( function (){
        from_parallel.should.eql([{
          '0' : 11
        }]);

        console.log( 'mixed without default passed' );
        callback();
      }, 150 );
    });
  }
};
