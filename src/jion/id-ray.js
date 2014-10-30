/*
| A jion id ray.
|
| To be used when an attribute or ray element can be
| one out of several type.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';

/*
| The jion definition.
*/
if( JION )
{
	return {
		id : 'jion.idRay',
		node : true,
		ray : [ 'jion.id' ]
	};
}


var
	idRay;


idRay =
module.exports =
	require( '../jion/this' )( module );


} )( );
