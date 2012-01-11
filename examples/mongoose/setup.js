var mongoose, Schema, ObjectId, User;

mongoose = require( 'mongoose' );
Schema   = mongoose.Schema;
ObjectId = Schema.ObjectId;



User = new Schema({

  name : { type : String, required : true, index: true },
  
  email : { type : String, required : true, index: true },

  created_at : { type : Date, 'default' : Date.now }

});



mongoose.model( 'User', User );
mongoose.connect( 'mongodb://localhost/node_flow_mongoose_example' );