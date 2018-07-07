/*
| Removes a tree node.
*/
'use strict';


tim.define( module, ( def, change_shrink ) => {


const change_generic = require( './generic' );

const change_grow = require( './grow' );

const change_insert = require( './insert' );

const change_join = require( './join' );

const change_list = require( './list' );

const change_mark_node = require( './mark/node' );

const change_mark_text = require( './mark/text' );

const change_remove = require( './remove' );

const change_set = require( './set' );

const change_split = require( './split' );

const change_wrap = require( './wrap' );

const change_wrapList = require( './wrapList' );

const error = require( './error' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// shrinks at this path
		path : { type : 'tim.js/path', json : true },

		// value the tree had
		prev : { type : [ '< ./value-types' ], json : true },

		// rank of new node
		rank : { type : 'integer', json : true },
	};

	def.json = 'change_shrink';

	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
	function( )
{
	if( this.rank !== undefined && this.rank < 0 )
	{
		throw error.make( 'set.rank negative' );
	}
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Returns the inversion to this change.
*/
def.lazy.reverse =
	function( )
{
	const inv =
		change_grow.create(
			'path', this.path,
			'val', this.prev,
			'rank', this.rank
		);

	tim.aheadValue( inv, 'reverse', this );

	return inv;
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Performs the insertion change on a tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	// Stores the old value for history tracking.
	const prev = tree.getPath( this.path );

	if( prev !== this.prev && !prev.equalsJSON( this.prev ) )
	{
		throw error.make( 'shrink.prev doesn\'t match' );
	}

	if( this.path.get( -2 ) !== 'twig' )
	{
		throw error.make( 'shrink.path( -2 ) with rank not twig' );
	}

	let pivot = tree.getPath( this.path.shorten.shorten );

	const key = this.path.get( -1 );

	const rank = pivot.rankOf( key );

	if( rank !== this.rank )
	{
		throw error.make( 'shrink.rank doesn\'t match' );
	}

	pivot = pivot.create( 'twig:remove', key );

	if( this.path.length > 2 )
	{
		tree = tree.setPath( this.path.shorten.shorten, pivot );
	}
	else
	{
		tree = pivot;
	}

	return tree;
};


/*
| Reversivly performs this change on a tree.
*/
def.func.changeTreeReverse = change_generic.changeTreeReverse;


/*
| Returns a change* transformed on this change.
*/
def.func.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.timtype )
	{
		case change_mark_text :
		case change_mark_node :

			return this._transformMark( cx );

		case change_grow :
		case change_shrink :

			// FUTURE fix rank
			return cx;

		case change_join :
		case change_set :
		case change_split :
		case change_insert :
		case change_remove :

			return this._transformJIRS( cx );

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
| Transforms a insert/remove/set/split changes
| by this shrink
*/
def.func._transformJIRS =
	function(
		cx
	)
{
	if( !this.path.subPathOf( cx.path ) ) return cx;

	return undefined;
};


/*
| Transforms a mark by this set.
*/
def.func._transformMark =
	function(
		mark
	)
{
	if( !this.path.subPathOf( mark.path ) ) return mark;

	return undefined;
};


/*
| Returns a change list transformed by this change.
*/
def.func._transformChangeList = change_generic.transformChangeList;


/*
| Returns a change wrap transformed by this change.
*/
def.func._transformChangeWrap = change_generic.transformChangeWrap;


/*
| Returns a change wrap list transformed by this change.
*/
def.func._transformChangeWrapList = change_generic.transformChangeWrapList;


} );

