var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new Schema({

  name : { type : String, required : true, index: true },

  email : { type : String, required : true, index: true },

  created_at : { type : Date, 'default' : Date.now }

});



mongoose.model( 'User', User );
mongoose.connect( 'mongodb://localhost/node_flow_mongoose_example' );