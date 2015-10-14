/*
| A ray of resources.
*/


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id : 'server_resourceRay',
		ray : [ 'server_resource' ]
	};
}


var
	jion;

jion = require( 'jion' );

jion.this( module );


}( ) );
