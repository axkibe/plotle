/*
| Removes a tree node.
*/
'use strict';


// FIXME
var
	change_generic,
	change_grow,
	change_error;


if( NODE )
{
	change_grow = require( './grow' );

	change_generic = require( './generic' );

	change_error = require( './error' );
}


tim.define( module, 'change_shrink', ( def, change_shrink ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// shrinks at this path
			type : 'tim$path',
			json : true
		},
		prev :
		{
			// value the tree had
			type : require( './typemap-value' ),
			json : true,
		},
		rank :
		{
			// rank of new node
			type : 'integer',
			json : true,
		}
	};

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
		throw change_error( 'set.rank negative' );
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
		throw change_error( 'shrink.prev doesn\'t match' );
	}

	if( this.path.get( -2 ) !== 'twig' )
	{
		throw change_error( 'shrink.path( -2 ) with rank not twig' );
	}

	let pivot = tree.getPath( this.path.shorten.shorten );

	const key = this.path.get( -1 );

	const rank = pivot.rankOf( key );

	if( rank !== this.rank )
	{
		throw change_error( 'shrink.rank doesn\'t match' );
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

	switch( cx.reflect )
	{
		case 'change_mark_text' :
		case 'change_mark_node' :

			return this._transformMark( cx );

		case 'change_grow' :
		case 'change_shrink' :

			// FUTURE fix rank
			return cx;

		case 'change_join' :
		case 'change_set' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :

			return this._transformJIRS( cx );

		case 'change_list' :

			return this._transformChangeList( cx );

		case 'change_wrap' :

			return this._transformChangeWrap( cx );

		case 'change_wrapList' :

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
	if( !this.path.subPathOf( cx.path ) )
	{
		return cx;
	}

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
	if( !this.path.subPathOf( mark.path ) )
	{
		return mark;
	}

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
