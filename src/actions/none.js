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
			'none',
		unit :
			'actions',
		singleton :
			true,
		subclass :
			'actions.action',
		equals :
			'primitive'
	};
}


} )( );
