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
		id :
			'ast.astNull',
		node :
			true,
		equals :
			'primitive',
		singleton :
			true
	};
}


require( '../jion/this' )( module );


} )( );
