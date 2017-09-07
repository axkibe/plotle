/*
| Sets a tree node.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_set',
		attributes :
		{
			path :
			{
				comment : 'set at this path',
				json : true,
				type : 'jion$path'
			},
			val :
			{
				comment : 'value to set',
				json : true,
				type : require( './typemap-value' )
			},
			prev :
			{
				comment : 'value tree had',
				json : true,
				type : require( './typemap-value' )
			}
		}
	};
}


var
	change_generic,
	change_error,
	change_set,
	jion;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	change_set = jion.this( module, 'source' );

	change_generic = require( './generic' );

	change_error = require( './error' );
}


prototype = change_set.prototype;


/*
| Performs the insertion change on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	var
		prev;

	// Stores the old value for history tracking.
	prev = tree.getPath( this.path );

	if( !this.val ) throw new Error( );

	if( prev !== this.prev && !prev.equalsJSON( this.prev ) )
	{
		console.log( 'set.prev mismatch', prev, this.prev );

		throw change_error( 'set.prev doesn\'t match' );
	}

	tree = tree.setPath( this.path, this.val );

	return tree;
};


/*
| Reversivly performs this change on a tree.
*/
prototype.changeTreeReverse = change_generic.changeTreeReverse;


/*
| Returns the inversion to this change.
*/
jion.lazyValue(
	prototype,
	'reverse',
	function( )
{
	var
		inv;

	inv =
		change_set.create(
			'path', this.path,
			'val', this.prev,
			'prev', this.val
		);

	jion.aheadValue( inv, 'reverse', this );

	return inv;
}
);


/*
| Returns a change* transformed on this change.
*/
prototype.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.reflect )
	{
		case 'change_grow' :
		case 'change_join' :
		case 'change_shrink' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :
		case 'change_mark_text' :
		case 'change_mark_node' :

			return cx;

		case 'change_set' :

			return this._transformChangeSet( cx );

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
| Transforms a set by this set actually
| happening first.
*/
prototype._transformChangeSet =
	function(
		cx
	)
{
	if( !this.path.equals( cx.path ) )
	{
		return cx;
	}

	if( cx.prev.equalsJSON( this.prev ) )
	{
		return cx.create( 'prev', this.val );
	}

	return cx;
};


/*
| Returns a change list transformed by this change.
*/
prototype._transformChangeList = change_generic.transformChangeList;


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrap = change_generic.transformChangeWrap;


/*
| Returns a change wrap list transformed by this change.
*/
prototype._transformChangeWrapList = change_generic.transformChangeWrapList;



}( ) );
