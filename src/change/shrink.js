/*
| Sets a tree node.
*/

var
	change_generic,
	change_grow,
	change_error,
	change_shrink,
	jools;


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
				type : 'jion_path'
			},
			prev :
			{
				comment : 'value tree had',
				json : 'true',
				type : require( '../typemaps/spaceVal' ),
				defaultValue : 'undefined'
			},
			rank :
			{
				comment : 'rank of new node',
				json : 'true',
				type : 'integer',
				allowsUndefined : true
			}
		},
		init : [ ]
	};
}


var
	prototype;


/*
| Node includes.
*/
if( SERVER )
{
	change_shrink = require( 'jion' ).this( module );

	change_grow = require( './grow' );

	change_generic = require( './generic' );

	change_error = require( './error' );

	jools = require( '../jools/jools' );
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
jools.lazyValue(
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

		jools.aheadValue( inv, 'invert', this );

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
		case 'mark_caret' :
		case 'mark_range' :
		case 'mark_item' :

			return this._transformMark( cx );

		case 'mark_widget' :

			return cx;

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
	if( !this.path.subPathOf( mark.path.chop ) )
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
