/*
| A null to be generated.
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
			'ast_null',
		equals :
			'primitive',
		singleton :
			true
	};
}


require( '../jion/this' )( module );


} )( );
