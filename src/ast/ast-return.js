/*
| abstract syntax tree returns statements.
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
			'ast.astReturn',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to return',
						type :
							'Object' // FUTURE ->expression
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../jion/this' )( module );


} )( );
