/*
| A point anchored within a frame.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_point',
		attributes :
		{
			anchor :
			{
				comment : 'compass of the anchor',
				type : 'string'
			},
			x :
			{
				comment : 'x-distance',
				type : 'integer'
			},
			y :
			{
				comment : 'y-distance',
				type : 'integer'
			}
		}
	};
}


var
	euclid_anchor_point,
	euclid_point,
	math_half;


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

prototype = euclid_anchor_point.prototype;


/*
| Point in center.
*/
euclid_anchor_point.c =
	euclid_anchor_point.create(
		'anchor', 'c',
		'x', 0,
		'y', 0
	);


/*
| Point in north west.
*/
euclid_anchor_point.nw =
	euclid_anchor_point.create(
		'anchor', 'nw',
		'x', 0,
		'y', 0
	);

/*
| Point in south east.
*/
euclid_anchor_point.se =
	euclid_anchor_point.create(
		'anchor', 'se',
		'x', 0,
		'y', 0
	);

/*
| Point in south east minus 1.
*/
euclid_anchor_point.seMin1 =
	euclid_anchor_point.create(
		'anchor', 'se',
		'x', -1,
		'y', -1
	);


/*
| Point in east.
*/
euclid_anchor_point.e =
	euclid_anchor_point.create(
		'anchor', 'e',
		'x', 0,
		'y', 0
	);

/*
| Point in west.
*/
euclid_anchor_point.w =
	euclid_anchor_point.create(
		'anchor', 'w',
		'x', 0,
		'y', 0
	);


/*
| Adds this point by another.
*/
prototype.add =
	function(
		a1,  // point or x
		a2   // ----- or y
	)
{
	switch( arguments.length )
	{
		case 1 :

/**/		if( CHECK )
/**/		{
/**/			if( a1.reflect !== 'euclid_point' ) throw new Error( );
/**/		}

			return(
				this.create(
					'x', this.x + a1.x,
					'y', this.y + a1.y
				)
			);
	
		case 2 :

			return(
				this.create(
					'x', this.x + a1,
					'y', this.y + a2
				)
			);
	
		default : throw new Error( );
	}
};



/*
| Computes the point to an euclid one.
*/
prototype.compute =
	function(
		frame,
		view
	)
{
	var
		pnw,
		pse,
		x,
		y;

/**/if( CHECK )
/**/{
/**/	if( frame.reflect !== 'euclid_rect' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( view && view.reflect !== 'euclid_view' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	pnw = frame.pnw;

	pse = frame.pse;

	x = this.x;

	y = this.y;

	if( view )
	{
		x = view.x( x );

		y = view.y( y );
	}

	switch( this.anchor )
	{
		case 'c'  :

			return(
				euclid_point.create(
					'x', math_half( pnw.x + pse.x ) + x,
					'y', math_half( pnw.y + pse.y ) + y
				)
			);

		case 'n'  :

			return(
				euclid_point.create(
					'x', math_half( pnw.x + pse.x ) + x,
					'y', pnw.y + y
				)
			);

		case 'ne' :

			return(
				euclid_point.create(
					'x', pse.x + x,
					'y', pnw.y + y
				)
			);

		case 'e'  :

			return(
				euclid_point.create(
					'x', pse.x + x,
					'y', math_half( pnw.y + pse.y ) + y
				)
			);

		case 'se' :

			return pse.add( x, y );

		case 's'  :

			return(
				euclid_point.create(
					'x', math_half( pnw.x + pse.x ) + x,
					'y', pse.y + y
				)
			);

		case 'sw' :

			return(
				euclid_point.create(
					'x', pnw.x + x,
					'y', pse.y + y
				)
			);

		case 'w'  :

			return(
				euclid_point.create(
					'x', pnw.x + x,
					'y', math_half( pnw.y + pse.y ) + y
				)
			);

		case 'nw' :

			return pnw.add( x, y );

		default :

			throw new Error( );
	}
};


})( );

