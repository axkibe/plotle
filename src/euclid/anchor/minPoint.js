/*
| A point anchored to another point
|
| It has an x- and y-distance to be changed with view.
| However, they are guaranteed to have at least minx/miny
| in real view.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_minPoint',
		attributes :
		{
			anchor :
			{
				comment : 'anchor of the fixpoint',
				type : 'euclid_anchor_point'
			},
			x :
			{
				comment : 'x-distance',
				type : 'number'
			},
			y :
			{
				comment : 'y-distance',
				type : 'number'
			},
			minx :
			{
				comment : 'x-distance',
				type : 'number'
			},
			miny :
			{
				comment : 'y-distance',
				type : 'number'
			}
		}
	};
}


var
	euclid_anchor_fixPoint,
	euclid_anchor_minPoint;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_anchor_minPoint.prototype;


/*
| Computes the point to an euclid one.
|
| FIXME make area part of view
*/
prototype.compute =
	function(
		area,
		view
	)
{
	var
		anchor,
		minx,
		miny,
		x,
		y;

/**/if( CHECK )
/**/{
/**/	if( area.reflect !== 'euclid_rect' ) throw new Error( );
/**/
/**/	if( view && view.reflect !== 'euclid_view' ) throw new Error( );
/**/}

	anchor = this.anchor.compute( area, view );

	minx = this.minx;

	miny = this.miny;

	x = view.scale( this.x );

	y = view.scale( this.y );

	if( minx < 0 )
	{
		x = Math.min( x, minx );
	}
	else if( minx > 0 )
	{
		x = Math.max( x, minx );
	}

	if( miny < 0 )
	{
		y = Math.min( y, miny );
	}
	else if( miny > 0 )
	{
		y = Math.max( y, miny );
	}

	return anchor.add( x, y );
};


/*
| Returns a fixPoint anchored to this.
*/
prototype.fixPoint =
	function(
		x,
		y
	)
{
	return(
		euclid_anchor_fixPoint.create(
			'anchor', this,
			'x', x,
			'y', y
		)
	);
};


})( );

