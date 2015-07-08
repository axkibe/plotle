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
	return {
		id : 'change_grow',
		attributes :
		{
			path :
			{
				comment : 'grow at this path',
				json : true,
				type : 'jion$path'
			},
			val :
			{
				comment : 'value to grow',
				json : true,
				type : require( '../typemaps/spaceVal' )
			},
			rank :
			{
				comment : 'rank of new node',
				json : true,
				type : 'integer'
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
if( NODE )
{
	jion = require( 'jion' );

	change_grow = jion.this( module, 'source' );

	change_generic = require( './generic' );

	change_error = require( './error' );
}


prototype = change_grow.prototype;


/*
| Initializer.
*/
prototype._init =
	function ( )
{
	if( this.rank !== undefined && this.rank < 0 )
	{
		throw change_error( 'grow.rank invalid' );
	}
};


/*
| Performs the growth change on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	var
		key,
		pivot,
		rank;

	if( this.path.get( -2 ) !== 'twig' )
	{
		throw change_error( 'grow.path( -2 ) not a twig' );
	}

	pivot = tree.getPath( this.path.shorten.shorten );

	key = this.path.get( -1 );

	rank = this.rank;

	if( rank > pivot.length )
	{
		throw change_error( 'grow.rank > pivot.length' );
	}

	pivot = pivot.create( 'twig:insert', key, rank, this.val );

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
	'reverse',
	function( )
	{
		var
			inv;

		inv =
			change_shrink.create(
				'path', this.path,
				'prev', this.val,
				'rank', this.rank
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
		case 'change_mark_text' :
		case 'change_mark_node' :

			return cx;

		case 'change_join' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :

			return cx;

		case 'change_grow' :
		case 'change_shrink' :

			// FUTURE fix ranks
			return cx;

		case 'change_set' :

			// FIXME change prev val of change_set
			return cx;

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
| Returns a change ray transformed by this change.
*/
prototype._transformChangeRay = change_generic.transformChangeRay;


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrap = change_generic.transformChangeWrap;


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrapRay = change_generic.transformChangeWrapRay;



}( ) );
