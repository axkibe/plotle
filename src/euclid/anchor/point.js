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
			x :
			{
				comment : 'x-distance',
				type : 'number',
				defaultValue : '0'
			},
			y :
			{
				comment : 'y-distance',
				type : 'number',
				defaultValue : '0'
			}
		}
	};
}


var
	euclid_anchor_fixPoint,
	euclid_anchor_point,
	jion;


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
*/
prototype.compute =
	function(
		tenter
	)
{
	var
		pnw,
		pse,
		x,
		y,
		w,
		h,
		zoom;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	zoom = 1;

	pnw = tenter.pnw;

	pse = tenter.pse;

	w = ( pse.x - pnw.x ) * zoom;

	h = ( pse.y - pnw.y ) * zoom;

	x = this.x * zoom;

	y = this.y * zoom;

	switch( this.anchor )
	{
		case 'c'  : return pnw.add( w / 2 + x, h / 2 + y );

		case 'n'  : return pnw.add( w / 2 + x, y );

		case 'ne' : return pnw.add( w + x, y );

		case 'e'  : return pnw.add( w + x, h / 2 + y );

		case 'se' : return pnw.add( w + x, h + y );

		case 's'  : return pnw.add( w / 2 + x, h + y );

		case 'sw' : return pnw.add( x, h + y );

		case 'w'  : return pnw.add( x, h / 2 + y );

		case 'nw' : return pnw.add( x, y );

		default : throw new Error( );
	}
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
| Point in north east.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'n',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'n',
			'x', 0,
			'y', 0
		)
	);
}
);


/*
| Point in north east.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'ne',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'ne',
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
| Point in south.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	's',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 's',
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
| Point in south west.
*/
jion.lazyStaticValue(
	euclid_anchor_point,
	'sw',
	function( )
{
	return(
		euclid_anchor_point.create(
			'anchor', 'sw',
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

