/*
| A ray of request wrappings.
|
| Authors: Axel Kittenberger
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
		id :
			'net.requestWrapRay',
		node :
			true,
		ray :
			[
				'net.requestWrap'
			],
		equals :
			'primitive'
	};
}


}( ) );
