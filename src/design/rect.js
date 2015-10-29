/*
| A rectangle (or a frame)
*/


var
	design_rect,
	euclid_rect;

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
	return {
		id : 'design_rect',
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = design_rect.prototype;


/*
| Computes a rect modelled relative to this rect.
*/
prototype.compute =
	function(
		frame
	)
{
	return euclid_rect.create(
		'pnw', this.pnw.compute( frame ),
		'pse', this.pse.compute( frame )
	);
};


})( );
