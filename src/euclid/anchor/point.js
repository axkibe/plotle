/*
| A point anchored within a area.
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
			shape :
			{
				comment : 'if defined anchor to this instead of view area',
				type :
					require( './typemap-shape' )
					.concat( [ 'undefined' ] )
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
			}
		}
	};
}


var
	euclid_anchor_fixPoint,
	euclid_anchor_point,
	euclid_point,
	jion,
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
		pnw,
		pse,
		x,
		y;

/**/if( CHECK )
/**/{
/**/	if( area.reflect !== 'euclid_rect' ) throw new Error( );
/**/
/**/	if( view && view.reflect !== 'euclid_view' ) throw new Error( );
/**/}

	pnw = area.pnw;

	pse = area.pse;

	if(
		this.anchor === 'nw'
		&& pnw.x === 0
		&& pnw.y === 0
		&& (
			!view
			|| (
				view.pan.x === 0
				&& view.pan.y === 0
				&& view.fact === 0
			)
		)
	)
	{
		return this.euclidPoint;
	}

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


/*
| The plain euclid_point equivalent,
| If anchor is nw and pan and parent pnw is zero
*/
jion.lazyValue(
	prototype,
	'euclidPoint',
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( this.anchor !== 'nw' ) throw new Error( );
/**/}

	return(
		euclid_point.create(
			'x', this.x,
			'y', this.y
		)
	);
}
);


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


/*
| Point in center.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'c',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'c',
			'x', 0,
			'y', 0
		)
	);
}
);


/*
| Point in north west.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'nw',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'nw',
			'x', 0,
			'y', 0
		)
	);
}
);


/*
| Point in south east.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'se',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'se',
			'x', 0,
			'y', 0
		)
	);
}
);


/*
| Point in south east minus 1.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'seMin1',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'se',
			'x', -1,
			'y', -1
		)
	);
}
);


/*
| Point in east.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'e',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'e',
			'x', 0,
			'y', 0
		)
	);
}
);


/*
| Point in west.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'w',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'w',
			'x', 0,
			'y', 0
		)
	);
}
);


})( );

