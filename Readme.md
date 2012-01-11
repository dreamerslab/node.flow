# node.flow

A deadly simple flow control package for node.js



## Description

The asynchronous nature of javascript is what makes it so powerful. However sometimes you just need to do stuffs synchronously. It is painful to design your application 

It is easily end up with nested callbacks 



## Requires

Checkout `package.json` for dependencies.



## Installation

Install node.flow through npm

    npm install node.flow



## Usage

> Require the module before using

    var Flow = require( 'node.flow' );

### new Flow( arg1, arg2, ... );

Start a new flow.

#### Arguments
- arg1, arg2, ...
  - type: Function | String | Array | Object | Boolean
  - desc: arguments to be passed as defaults.

#### Example code

    var flow = new Flow( 'bibi', 22, true );

### flow.add( task, arg1, arg2, ... );

Add task to the flow stack.

#### Arguments
- task:
  - type: Function
  - desc: Task function to be called later
- arg1, arg2, ...
  - type: Function | String | Array | Object | Boolean
  - desc: Arguments to be passed to the task function( optional )

#### Example code

    var Flow = require( 'node.flow' ),
        flow = new Flow(),

    // Add a task function, the last argument in the task callback
    // is always the next task
    flow.add( function( name, sort, next ){
      User.find({
        name : name
      }).sort( sort, -1 ).run( function ( err, users ){
        next( users );
      });

    // 'bibi' will be passed to the task function as the first argument `name`
    // and 'created_at' will be the second argument `sort`
    // you can add as many arguments as you want
    }, 'bibi', 'created_at' );

### flow.end( callback, arg1, arg2, ... );

Call the tasks one after another in the stack.

#### Arguments
- callback:
  - type: Function
  - desc: The last callback to be called at the very end after all tasks are done
- arg1, arg2, ...
  - type: Function | String | Array | Object | Boolean
  - desc: Arguments to be passed to the callback function( optional )

#### Example code

    var Flow = require( 'node.flow' ),
        flow = new Flow(),
        users = {};

    // find users with the given names
    [ 'fifi', 'jenny', 'steffi' ].forEach( function ( name ){
      // add 3 tasks searching for users
      flow.add( function( users, name, next ){
        User.findOne({
          name : name
        }, function ( err, user ){
          users[ name ] = user;
          next( users );
        });
      }, name, users )
    });

    // print out the search results
    flow.end( function( users ){
      console.log( users );
    });

## Arguments merge and overwrite
  
With 

## Chainability

You can either choose to chain your methods or not up to your prefered syntax. Both of the following syntax works.
    
    // chaining all methods
    flow.add( function (){
      // task 1
    }).add( function (){
      // task 2
    }).end( function (){
      // all done callback
    });
    
    // seperate all methods
    flow.add( function (){
      // task 1
    });
    
    flow.add( function (){
      // task 2
    }).
    
    flow.end( function (){
      // all done callback
    });

## Examples

> Checkout the `examples` folder for more details.

### simple

> Demonstrate some basic usage and syntax. We use setTimeout to simulate a time consuming io operation.

    $ cd /path/to/node.flow/examples/simple
    $ node run.js

### mongoose

> Demonstrate how to clear the documents before inserting a bunch of records then finding some records with given conditions in a loop and show them without writing nested callbacks.

    # make sure your mongoDB is on
    $ cd /path/to/node.flow/examples/mongoose
    $ npm install -lf
    $ node run.js

### node.packer

> Demonstrate

    $ cd /path/to/node.flow/examples/node.packer
    $ npm install -lf
    $ node app.js



## License

(The MIT License)

Copyright (c) 2011 dreamerslab &lt;ben@dreamerslab.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.