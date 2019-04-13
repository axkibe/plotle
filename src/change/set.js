/*
| Sets a tree node.
*/
'use strict';


tim.define( module, ( def, change_set ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// set at this path
		path : { type : 'tim.js/path', json : true },

		// value to set
		val : { type : [ 'undefined', '< ./value-types' ], json : true },

		// the value the tree had
		prev : { type : [ 'undefined', '< ./value-types' ], json : true },
	};

	def.json = 'change_set';
}


const change_grow = tim.require( './grow' );

const change_insert = tim.require( './insert' );

const change_join = tim.require( './join' );

const change_list = tim.require( './list' );

const change_mark_node = tim.require( './mark/node' );

const change_mark_text = tim.require( './mark/text' );

const change_remove = tim.require( './remove' );

const change_shrink = tim.require( './shrink' );

const change_split = tim.require( './split' );

const change_wrap = tim.require( './wrap' );

const change_wrapList = tim.require( './wrapList' );

const error = tim.require( './error' );


/*
| Returns the inversion to this change.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_set.create(
			'path', this.path,
			'val', this.prev,
			'prev', this.val
		);

	tim.aheadValue( inv, 'reversed', this );

	return inv;
};


/*
| Performs the insertion change on a tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	// Stores the old value for history tracking.
	const prev = tree.getPath( this.path );

	// if( this.val === undefined ) throw new Error( );

	if( prev !== this.prev && !prev.equalsJSON( this.prev ) )
	{
		console.log( 'set.prev mismatch', prev, this.prev );

		throw error.make( 'set.prev doesn\'t match' );
	}

	return tree.setPath( this.path, this.val );
};


/*
| Maps transformables to transform functions
*/
def.staticLazy._transformers = ( ) =>
{
	const map = new Map( );

	const tSame           = ( c ) => c;
	const tSet            = function( c ) { return this._transformSet( c ); };
	const tChangeList     = function( c ) { return this._transformChangeList( c ); };
	const tChangeWrap     = function( c ) { return this._transformChangeWrap( c ); };
	const tChangeWrapList = function( c ) { return this._transformChangeWrapList( c ); };

	map.set( change_grow,      tSame );
	map.set( change_join,      tSame );
	map.set( change_shrink,    tSame );
	map.set( change_split,     tSame );
	map.set( change_insert,    tSame );
	map.set( change_remove,    tSame );
	map.set( change_mark_text, tSame );
	map.set( change_mark_node, tSame );

	map.set( change_set,       tSet );

	map.set( change_list,      tChangeList );
	map.set( change_wrap,      tChangeWrap );
	map.set( change_wrapList,  tChangeWrapList );

	return map;
};


/*
| Transforms a set by this set actually
| happening first.
*/
def.proto._transformChangeSet =
	function(
		cx
	)
{
	if( !this.path.equals( cx.path ) ) return cx;

	if( cx.prev.equalsJSON( this.prev ) ) return cx.create( 'prev', this.val );

	return cx;
};


} );
