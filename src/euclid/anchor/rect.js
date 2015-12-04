/*
| A rectangle (or a frame)
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
| Computes to an unanchored rect for a frame/view:
*/
prototype.compute =
	function(
		frame,
		view
	)
{
	return(
		euclid_rect.create(
			'pnw', this.pnw.compute( frame, view ),
			'pse', this.pse.compute( frame, view )
		)
	);
};


})( );
