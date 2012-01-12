// setup db schema and connection
require( './setup' );

var Flow     = require( '../../lib/flow' ),
    mongoose = require( 'mongoose' ),
    User     = mongoose.model( 'User' ),
    data     = require( './data' );

var flow  = new Flow,
    users = {};

// delete all users before start
flow.series( function ( next ){
  User.remove( function ( err, count ){
    next();
  });
});

// insert records from source data
data.users.forEach( function ( user ){
  flow.parallel( function ( user, next ){
    new User( user ).save( function ( err, user ){
      next();
    });
  }, user );
});

flow.join();

// find matching records
data.names.forEach( function ( name ){
  flow.series( function( users, name, next ){
    User.findOne({
      name : name
    }, function ( err, user ){
      users[ name ] = user;
      next( users );
    });
  }, users, name );
});

// print out records and disconnect
flow.end( function( users ){
  console.log( users );
  mongoose.disconnect();
});