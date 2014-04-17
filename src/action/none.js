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
| The joobj definition.
*/
if( JOOBJ )
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
