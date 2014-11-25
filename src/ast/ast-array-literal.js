/*
| Array literals in abstract syntax trees.
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
			'ast.astArrayLiteral',
		equals :
			'primitive', // FUTURE
		ray :
			// '->expression' // FUTURE
			[ ]
	};
}


require( '../jion/this' )( module );


} )( );
