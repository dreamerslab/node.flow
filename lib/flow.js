/*!
 * node.flow
 * Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A deadly simple flow control package for node.js
 */



/**
 * @private
 * @function
 */
var extend = require( 'node.extend' ),
    slice  = [].slice;



/**
 * Creates a new Flow.
 * @class Represents a flow control.
 * @requires extend
 * @constructor
 */
var Flow = function (){
  /**
   * Default auguments for all task functions.
   * @type {Array}
   * @default []
   */
  this._defaults = slice.call( arguments ) || [];
  
  /**
   * Augument stack
   * @type {Array}
   */
  this._args = [];
  
  /**
   * Task stack
   * @type {Array}
   */
  this._tasks = [];
};



Flow.prototype = {

/**
 * Call the current task function and remove it.
 * @private
 * @this {Flow}
 * @param {Array} args Arguments to be passed to the current task function.
 */
  _run : function ( args ){
    this._tasks.shift().apply( this, args );
  },



/**
 * Merge the next task arguments and call the next task function.
 * @private
 * @this {Flow}
 * @param {String|Number|Array|Object|Function} [arguments[ n ]] Arguments to be merged with the current arguments.
 */
  _next : function (){
    var stack_args = this._args.shift();

    if( stack_args ){
      extend( true, stack_args, slice.call( arguments ));
      this._run( stack_args );
    }
  },



/**
 * Add task to the flow stack.
 * @public
 * @this {Flow}
 * @param {Function} arguments[ 0 ] Task function.
 * @param {String|Number|Array|Object|Function} [arguments[ 1 ]] Arguments to be passed to the task function.
 * @return {this} Return `this` to enable chaining.
 * @example
 *
 *     var Flow = require( 'node.flow' ),
 *         flow = new Flow(),
 *
 *     flow.add( function( name, sort, next ){
 *       User.find({
 *         name : name
 *       }).sort( sort, -1 ).run( function ( err, users ){
 *         next( users );
 *       });
 *     }, 'bibi', 'created_at' );
 */
  add : function (){
    var self, task, args;

    self = this;
    task = [].shift.call( arguments );
    args = extend( true, [], this._defaults );

    extend( true, args, slice.call( arguments ));
    args.push( function (){
      self._next.apply( self, slice.call( arguments ));
    });

    this._args.push( args );
    this._tasks.push( task );

    return this;
  },



/**
 * Call the tasks one after another in the stack.
 * @public
 * @this {Flow}
 * @param {Function} arguments[ 0 ] Callback function when all tasks are finished.
 * @param {String|Number|Array|Object|Function} [arguments[ 1 ]] Arguments to be passed to the callback.
 * @return {this} Return `this` to enable chaining.
 * @example
 *
 *     var Flow = require( 'node.flow' ),
 *         flow = new Flow(),
 *         users = {};
 *    
 *     [ 'fifi', 'jenny', 'steffi' ].forEach( function ( name ){
 *       flow.add( function( users, name, next ){
 *         User.findOne({
 *           name : name
 *         }, function ( err, user ){
 *           users[ name ] = user;
 *           next( users );
 *         });
 *       }, name, users )
 *     });
 *    
 *     flow.end( function( users ){
 *       console.log( users );
 *     });
 */
  end : function (){
    this.add.apply( this, arguments ).
         _run( this._args.shift());

    return this;
  }
};



/**
 * @public
 * @version 0.0.1
 */
Flow.version = '0.0.1';



/**
 * @exports Flow as node.flow
 */
module.exports = Flow;