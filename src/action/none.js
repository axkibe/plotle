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
			'Action',
		singleton :
			true,
		subclass :
			'Action.Action',
		equals :
			'primitive'
	};
}


} )( );
