/*
| A group of points.
*/


/*
| Capsule
*/
( function( ) {
'use strict';


var
	jion;

/*
| The jion definition.
*/
if( JION )
{
	return {
		id : 'fabric_pointGroup',
		group : [ 'euclid_point' ]
	};
}


if( NODE )
{
	jion = require( 'jion' );

	jion.this( module, 'source' );
}


} )( );
