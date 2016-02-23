/*
| A scaled shape.
|
| Does not recompute points by itself.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_scale',
		attributes :
		{
			distance :
			{
				comment : 'the distance to scale',
				type : 'number'
			},
			shape :
			{
				comment : 'the shape to scale',
				type :
					require( '../typemaps/shape' )
					.concat( 'euclid_shapeRay' )
			},
		},
	};
}


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


})( );
