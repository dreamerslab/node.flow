var packer = require( 'node.packer' ),
    Flow   = require( 'node.flow' );



flow = new Flow({
  log : true,
  input : input,
  output : BASE_DIR + 'tmp/' + group + '.' + type,
  minify : true,
  callback : each // = function ( err, stdout, stderr ){};
});

packer({
  log : true,
  type : type,
  input : input,
  output : BASE_DIR + 'tmp/' + group + '.' + type,
  minify : true,
  callback : each // = function ( err, stdout, stderr ){};
});
