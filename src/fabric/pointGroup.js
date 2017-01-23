/*
| A group of points.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'fabric_pointGroup',
		group : [ 'gleam_point' ]
	};
}


/*
| Capsule
*/
( function( ) {
'use strict';


var
	jion;


if( NODE )
{
	jion = require( 'jion' );

	jion.this( module, 'source' );
}


} )( );
