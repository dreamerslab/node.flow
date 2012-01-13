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
   * Series augument stack
   * @type {Array}
   */
  this._series_args = [];

  /**
   * Series task stack
   * @type {Array}
   */
  this._series = [];

  /**
    * Parallel augument stack
    * @type {Array}
    */
   this._ready_args = [];

  /**
   * Parallel augument stack
   * @type {Array}
   */
  this._parallel_args = [];

  /**
   * Parallel task stack
   * @type {Array}
   */
  this._parallel = [];

  /**
   * Parallel task group create counter
   * @type {Number}
   */
  this._group = 0;

  /**
   * Parallel task group execute counter
   * @type {Number}
   */
  this._count = 0;
};



Flow.prototype = {

/**
 * Call the current series function and remove it.
 * @private
 * @this {Flow}
 * @param {Array} args Arguments to be passed to the current series function.
 */
  _run_series : function ( args ){
    this._series.shift().apply( this, args );
  },



/**
 * Merge the next task arguments and call the next series function.
 * @private
 * @this {Flow}
 * @param {String|Number|Array|Object|Function} [arguments[ n ]] Arguments to be merged with the current arguments.
 */
  _next : function (){
    var stack_series_args = this._series_args.shift();

    if( stack_series_args ){
      extend( true, stack_series_args, slice.call( arguments ));
      this._run_series( stack_series_args );
    }
  },



/**
 * Call the current parallel functions and remove it.
 * @private
 * @this {Flow}
 */
  _run_parallel : function (){
    var self, args;

    self        = this;
    args        = this._parallel_args.shift();
    this._count = args.length;

    this._parallel.shift().forEach( function ( task ){
      task.apply( self, args.shift());
    });

    this._group--;
  },



/**
 * Push the arguments from parallel tasks to a global stack, 
 * merge them with the next task arguments and fire `this._run_series` at the last run
 * @private
 * @this {Flow}
 * @param {String|Number|Array|Object} [arguments[ n ]] Arguments to be merged with the next task arguments.
 */
  _ready : function (){
    var arg, stack_series_args;
    
    if( arguments.length > 0 ){
      this._ready_args.push( arguments );
    }
    
    this._count--;

    if( this._count === 0 ){
      stack_series_args = this._series_args.shift();
      
      if( this._ready_args.length > 0 ){
        stack_series_args.unshift( this._ready_args );
      }
      
      arg = stack_series_args;
      
      this._run_series( arg );
      this._ready_args = [];
    }
  },



/**
 * Add series or parallel task to the flow stack.
 * @public
 * @this {Flow}
 * @param {Arguments} args Arguments from this.series or this.parallel.
 * @param {String} next_type Assign this._next or this._ready to be the last prop in the arguments.
 * @param {Function} callback Callback function for this.series or this.parallel.
 */
  _add : function ( args, next_type, callback ){
    var self, task, _args;

    self  = this;
    task  = [].shift.call( args );
    _args = extend( true, [], this._defaults );

    extend( true, _args, slice.call( args ));
    _args.push( function (){
      self[ '_' + next_type ].apply( self, slice.call( arguments ));
    });

    callback( _args, task );
  },



/**
 * Add series task to the flow stack.
 * @public
 * @this {Flow}
 * @param {Function} arguments[ 0 ] Task function to be called in series.
 * @param {String|Number|Array|Object|Function} [arguments[ 1 ]] Arguments to be passed to the task function(optional).
 * @return {this} Return `this` to enable chaining.
 * @example
 *
 *     var Flow = require( 'node.flow' ),
 *         flow = new Flow(),
 *
 *     flow.series( function( name, sort, next ){
 *       User.find({
 *         name : name
 *       }).sort( sort, -1 ).run( function ( err, users ){
 *         next( users );
 *       });
 *     }, 'bibi', 'created_at' );
 */
  series : function (){
    var self = this;

    this._add( arguments, 'next', function ( args, task ){
      self._series_args.push( args );
      self._series.push( task );
    });

    return this;
  },



/**
 * Add parallel task to the flow stack.
 * @public
 * @this {Flow}
 * @param {Function} arguments[ 0 ] Task function to be called in parallel.
 * @param {String|Number|Array|Object|Function} [arguments[ 1 ]] Arguments to be passed to the task function.
 * @return {this} Return `this` to enable chaining.
 * @example
 *
 *     var Flow = require( 'node.flow' ),
 *         flow = new Flow();
 *
 *     flow.parallel( function( name, sort, ready ){
 *       User.find({
 *         name : name
 *       }).sort( sort, -1 ).run( function ( err, users ){
 *         ready( users );
 *       });
 *     }, 'bibi', 'created_at' );
 */
  parallel : function (){
    var self = this;

    this._add( arguments, 'ready', function ( args, task ){
      var group = self._group;

      if( self._parallel[ group ] === undefined ){
        self._parallel_args[ group ] = [];
        self._parallel[ group ]      = [];
      }

      self._parallel_args[ group ].push( args );
      self._parallel[ group ].push( task );
    });

    return this;
  },



/**
 * Set an end point for a group of parallel tasks.
 * @public
 * @this {Flow}
 * @return {this} Return `this` to enable chaining.
 * @example
 *
 *     var Flow = require( 'node.flow' ),
 *         flow = new Flow();
 *
 *     flow.parallel( function( name, sort, ready ){
 *       User.find({
 *         name : name
 *       }).sort( sort, -1 ).run( function ( err, users ){
 *         ready( users );
 *       });
 *     }, 'bibi', 'created_at' );
 *
 *     flow.join();
 */
  join : function (){
    var self = this;

    this.series( function (){
      self._run_parallel();
    });

    this._group++;

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
 *       flow.series( function( users, name, next ){
 *         User.findOne({
 *           name : name
 *         }, function ( err, user ){
 *           users[ name ] = user;
 *           next( users );
 *         });
 *       }, name, users );
 *     });
 *
 *     flow.end( function( users ){
 *       console.log( users );
 *     });
 */
  end : function (){
    this.series.apply( this, arguments ).
         _run_series( this._series_args.shift());

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
