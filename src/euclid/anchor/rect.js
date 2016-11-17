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
				type : 'euclid_anchor_point'
			},
			pse :
			{
				comment : 'point in south-east',
				type : 'euclid_anchor_point'
			}
		}
	};
}


var
	euclid_anchor_border,
	euclid_anchor_rect,
	euclid_rect;

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
| Computes to an unanchored rect for a tenter:
*/
prototype.compute =
	function(
		tenter
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return(
		euclid_rect.create(
			'pnw', this.pnw.compute( tenter ),
			'pse', this.pse.compute( tenter )
		)
	);
};


})( );
