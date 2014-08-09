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
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'aNull',
		unit :
			'ast',
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
	require( '../jion/this' )( module );


} )( );
