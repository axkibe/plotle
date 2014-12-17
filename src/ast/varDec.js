/*
| Variable declarations in abstract syntax trees.
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
			'ast_varDec',
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
			}
	};
}


require( '../jion/this' )( module );


} )( );
