/*
| A rectangle (or a areae)
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_rect',
		attributes :
		{
			pnw :
			{
				comment : 'point in north-west',
				type : require( './typemap-points.js' )
			},
			pse :
			{
				comment : 'point in south-east',
				type : require( './typemap-points.js' )
			}
		}
	};
}


var
	euclid_anchor_border,
	euclid_anchor_point,
	euclid_anchor_rect,
	euclid_rect,
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

prototype = euclid_anchor_rect.prototype;


/*
| Returns an euclid_anchor_border for this
| anchored shape.
*/
prototype.border =
	function(
		d
	)
{
	return(
		euclid_anchor_border.create(
			'distance', d,
			'shape', this
		)
	);
};


/*
| Computes to an unanchored rect for an area/view:
*/
prototype.compute =
	function(
		view
	)
{
		
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return(
		euclid_rect.create(
			'pnw', this.pnw.compute( view ),
			'pse', this.pse.compute( view )
		)
	);
};


/*
| Rect filling the full area.
*/
euclid_anchor_rect.full =
	euclid_anchor_rect.create(
		'pnw', euclid_anchor_point.nw,
		'pse', euclid_anchor_point.seMin1
	);


/*
| Point in east.
*/
jion.lazyValue(
	prototype,
	'pe',
	function( )
{
	return(
		euclid_anchor_point.e.create(
			'tenter', this
		)
	);
}
);


/*
| Point in north.
*/
jion.lazyValue(
	prototype,
	'pn',
	function( )
{
	return(
		euclid_anchor_point.n.create(
			'tenter', this
		)
	);
}
);


/*
| Point in north east.
*/
jion.lazyValue(
	prototype,
	'pne',
	function( )
{
	return(
		euclid_anchor_point.ne.create(
			'tenter', this
		)
	);
}
);


/*
| Point in south.
*/
jion.lazyValue(
	prototype,
	'ps',
	function( )
{
	return(
		euclid_anchor_point.s.create(
			'tenter', this
		)
	);
}
);


/*
| Point in south west.
*/
jion.lazyValue(
	prototype,
	'psw',
	function( )
{
	return(
		euclid_anchor_point.sw.create(
			'tenter', this
		)
	);
}
);


/*
| Point in west.
*/
jion.lazyValue(
	prototype,
	'pw',
	function( )
{
	return(
		euclid_anchor_point.w.create(
			'tenter', this
		)
	);
}
);


})( );
