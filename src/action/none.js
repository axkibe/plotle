/*
| The non-action.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'None',
		unit :
			'action',
		singleton :
			true,
		subclass :
			'action.action',
		equals :
			'primitive'
	};
}


} )( );
