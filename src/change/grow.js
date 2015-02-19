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
	return {
		id :
			'change_grow',
		attributes :
			{
				path :
					{
						comment :
							'grow at this path',
						json :
							'true',
						type :
							'jion_path'
					},
				val :
					{
						comment :
							'value to grow',
						json :
							'true',
						type :
							'->spaceVal',
						allowsNull :
							true
					},
				rank :
					{
						comment :
							'rank of new node',
						json :
							'true',
						type :
							'integer'
					}
			},
		init :
			[ ]
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	change_grow = require( '../jion/this' )( module );

	change_generic = require( './generic' );

	change_error = require( './error' );

	jools = require( '../jools/jools' );
}


/*
| Initializer.
*/
change_grow.prototype._init =
	function ( )
{
	if( this.rank !== undefined && this.rank < 0 )
	{
		throw change_error( 'grow.rank negative' );
	}
};


/*
| Performs the growth change on a tree.
*/
change_grow.prototype.changeTree =
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

	pivot = tree.getPath( this.path.shorten( 2 ) );

	key = this.path.get( -1 );

	rank = this.rank;

	if( rank > pivot.length )
	{
		throw change_error( 'grow.rank > pivot.length' );
	}

	pivot = pivot.create( 'twig:insert', key, rank, this.val );

	if( this.path.length > 2 )
	{
		tree = tree.setPath( this.path.shorten( 2 ), pivot );
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
	change_grow.prototype,
	'invert',
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

		// FIXME aheadValue inv to be this

		return inv;
	}
);


/*
| Returns a change* transformed on this change.
*/
change_grow.prototype.transform =
	function(
		cx
	)
{
	if( cx === null )
	{
		return null;
	}

	switch( cx.reflect )
	{
		case 'mark_caret' :
		case 'mark_range' :
		case 'mark_item' :
		case 'mark_widget' :

			return cx;

		case 'change_join' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :

			return cx;

		case 'change_grow' :
		case 'change_shrink' :

			// FIXME fix ranks
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
change_grow.prototype._transformChangeRay =
	change_generic.transformChangeRay;


/*
| Returns a change wrap transformed by this change.
*/
change_grow.prototype._transformChangeWrap =
	change_generic.transformChangeWrap;


/*
| Returns a change wrap transformed by this change.
*/
change_grow.prototype._transformChangeWrapRay =
	change_generic.transformChangeWrapRay;



}( ) );