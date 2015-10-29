/*
| A point anchored within a frame.
*/


var
	design_point,
	euclid_point,
	math_half;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return{
		id : 'design_point',
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = design_point.prototype;


/*
| Point in center.
*/
design_point.c =
	design_point.create(
		'anchor', 'c',
		'x', 0,
		'y', 0
	);


/*
| Point in north west.
*/
design_point.nw =
	design_point.create(
		'anchor', 'nw',
		'x', 0,
		'y', 0
	);

/*
| Point in south east.
*/
design_point.se =
	design_point.create(
		'anchor', 'se',
		'x', 0,
		'y', 0
	);

/*
| Point in south east minus 1.
*/
design_point.seMin1 =
	design_point.create(
		'anchor', 'se',
		'x', -1,
		'y', -1
	);


/*
| Point in east.
*/
design_point.e =
	design_point.create(
		'anchor', 'e',
		'x', 0,
		'y', 0
	);

/*
| Point in west.
*/
design_point.w =
	design_point.create(
		'anchor', 'w',
		'x', 0,
		'y', 0
	);


/*
| Adds this point by another.
*/
prototype.add =
	function(
		p
	)
{

/**/if( CHECK )
/**/{
/**/	if( p.reflect !== 'euclid_point' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		this.create(
			'x', this.x + p.x,
			'y', this.y + p.y
		)
	);
};



/*
| Computes the point to an euclid one.
*/
prototype.compute =
	function(
		frame
	)
{
	var
		pnw,
		pse;

/**/if( CHECK )
/**/{
/**/	if( frame.reflect !== 'euclid_rect' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	pnw = frame.pnw;

	pse = frame.pse;

	switch( this.anchor )
	{
		case 'c'  :

			return(
				euclid_point.create(
					'x', math_half( pnw.x + pse.x ) + this.x,
					'y', math_half( pnw.y + pse.y ) + this.y
				)
			);

		case 'n'  :

			return(
				euclid_point.create(
					'x', math_half( pnw.x + pse.x ) + this.x,
					'y', pnw.y + this.y
				)
			);

		case 'ne' :

			return(
				euclid_point.create(
					'x', pse.x + this.x,
					'y', pnw.y + this.y
				)
			);

		case 'e'  :

			return(
				euclid_point.create(
					'x', pse.x + this.x,
					'y', math_half( pnw.y + pse.y ) + this.y
				)
			);

		case 'se' :

			return pse.add( this.x, this.y );

		case 's'  :

			return(
				euclid_point.create(
					'x', math_half( pnw.x + pse.x ) + this.x,
					'y', pse.y + this.y
				)
			);

		case 'sw' :

			return(
				euclid_point.create(
					'x', pnw.x + this.x,
					'y', pse.y + this.y
				)
			);

		case 'w'  :

			return(
				euclid_point.create(
					'x', pnw.x + this.x,
					'y', math_half( pnw.y + pse.y ) + this.y
				)
			);

		case 'nw' :

			return pnw.add( this.x, this.y );

		default :

			throw new Error( );
	}
};


})( );
