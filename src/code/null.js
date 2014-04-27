/*
| A null to be generated
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Null',
		unit :
			'Code',
		node :
			true,
		equals :
			'primitive',
		singleton :
			true
	};
}


/*
| Node export.
*/
module.exports =
	require( '../joobj/this' )( module );


} )( );
