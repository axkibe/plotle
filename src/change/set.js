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
		val : { type : [ '< ./value-types' ], json : true },

		// the value the tree had
		prev : { type : [ '< ./value-types' ], json : true },
	};

	def.json = 'change_set';
}


const change_grow = require( './grow' );

const change_insert = require( './insert' );

const change_join = require( './join' );

const change_list = require( './list' );

const change_mark_node = require( './mark/node' );

const change_mark_text = require( './mark/text' );

const change_remove = require( './remove' );

const change_shrink = require( './shrink' );

const change_split = require( './split' );

const change_wrap = require( './wrap' );

const change_wrapList = require( './wrapList' );

const error = require( './error' );


/*
| Returns the inversion to this change.
*/
def.lazy.reverse =
	function( )
{
	const inv =
		change_set.create(
			'path', this.path,
			'val', this.prev,
			'prev', this.val
		);

	tim.aheadValue( inv, 'reverse', this );

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

	if( this.val === undefined ) throw new Error( );

	if( prev !== this.prev && !prev.equalsJSON( this.prev ) )
	{
		console.log( 'set.prev mismatch', prev, this.prev );

		throw error.make( 'set.prev doesn\'t match' );
	}

	return tree.setPath( this.path, this.val );
};


/*
| Returns a change* transformed on this change.
*/
def.proto.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.timtype )
	{
		case change_grow :
		case change_join :
		case change_shrink :
		case change_split :
		case change_insert :
		case change_remove :
		case change_mark_text :
		case change_mark_node :

			return cx;

		case change_set :

			return this._transformChangeSet( cx );

		case change_list :

			return this._transformChangeList( cx );

		case change_wrap :

			return this._transformChangeWrap( cx );

		case change_wrapList :

			return this._transformChangeWrapList( cx );

		default :

			throw new Error( );
	}
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
