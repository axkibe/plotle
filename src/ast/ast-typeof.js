/*
| A Typeof of an expression
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
			'ast.astTypeof',
		attributes :
			{
				'expr' :
					{
						comment :
							'the expression to get the type of',
						type :
							'Object'
							// FUTURE ->expression
					},
			}
	};
}


require( '../jion/this' )( module );


} )( );
