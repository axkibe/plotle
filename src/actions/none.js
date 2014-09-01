/*
| The non-action.
|
| FUTURE remove
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
		id :
			'actions.none',
		singleton :
			true,
		subclass :
			'actions.action',
		equals :
			'primitive'
	};
}


} )( );
