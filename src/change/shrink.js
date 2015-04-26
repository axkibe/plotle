/*
| Sets a tree node.
*/

var
	change_generic,
	change_grow,
	change_error,
	change_shrink,
	jion;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'change_shrink',
		attributes :
		{
			path :
			{
				comment : 'shrink at this path',
				json : 'true',
				type : 'jion$path'
			},
			prev :
			{
				comment : 'value tree had',
				json : 'true',
				// FIXME can this ever be undefined?
				type :
					require( '../typemaps/spaceVal' )
					.concat( [ 'undefined' ] )
			},
			rank :
			{
				comment : 'rank of new node',
				json : 'true',
				// FIXME can this ever be undefined?
				type : [ 'undefined', 'integer' ]
			}
		},
		init : [ ]
	};
}


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	change_shrink = jion.this( module, 'source' );

	change_grow = require( './grow' );

	change_generic = require( './generic' );

	change_error = require( './error' );
}


prototype = change_shrink.prototype;


/*
| Initializer.
*/
prototype._init =
	function ( )
{
	if( this.rank !== undefined && this.rank < 0 )
	{
		throw change_error( 'set.rank negative' );
	}
};


/*
| Performs the insertion change on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	var
		key,
		pivot,
		prev,
		rank;

	// Stores the old value for history tracking.
	prev = tree.getPath( this.path );

	if(
		prev !== this.prev
		&&
		!prev.equalsJSON( this.prev )
	)
	{
		throw change_error( 'shrink.prev doesn\'t match' );
	}

	if( this.path.get( -2 ) !== 'twig' )
	{
		throw change_error( 'shrink.path( -2 ) with rank not twig' );
	}

	pivot = tree.getPath( this.path.shorten.shorten );

	key = this.path.get( -1 );

	rank = pivot.rankOf( key );

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
| Returns the inversion to this change.
*/
jion.lazyValue(
	prototype,
	'invert',
	function( )
	{
		var
			inv;

		inv =
			change_grow.create(
				'path', this.path,
				'val', this.prev,
				'rank', this.rank
			);

		jion.aheadValue( inv, 'invert', this );

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
		case 'change_mark_text' :
		case 'change_mark_node' :

			return this._transformMark( cx );

		case 'change_grow' :
		case 'change_shrink' :

			// FIXME fix rank
			return cx;

		case 'change_join' :
		case 'change_set' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :

			return this._transformJIRS( cx );

		case 'change_ray' :

			return this._transformChangeRay( cx );

		case 'change_wrap' :

			return this._transformChangeWrap( cx );

		case 'change_wrapRay' :

			return this._transformChangeWrapRay( cx );

		default :

			throw new Error( );
	}
};


/*
| Transforms a jion/insert/remove/set/split changes
| by this shrink
*/
prototype._transformJIRS =
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
prototype._transformMark =
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
| Returns a change ray transformed by this change.
*/
prototype._transformChangeRay =
	change_generic.transformChangeRay;


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrap =
	change_generic.transformChangeWrap;


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrapRay =
	change_generic.transformChangeWrapRay;



}( ) );
