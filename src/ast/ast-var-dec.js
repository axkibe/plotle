/*
| Variable declarations in abstract syntax trees.
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
			'ast.astVarDec',
		attributes :
			{
				name :
					{
						comment :
							'variable name',
						type :
							'String'
					},
				assign :
					{
						comment :
							'Assignment of variable',
						type :
							'Object', // FUTURE ->expression
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


require( '../jion/this' )( module );


} )( );
