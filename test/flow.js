var flow   = require( '../lib/flow' );
var should = require( 'should' );

module.exports = {

  'test .version' : function ( callback ){
    flow.version.should.match( /^\d+\.\d+\.\d+$/ );
    callback();
  }
};
