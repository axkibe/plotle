/*
| Abstract syntax tree returns statements.
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


require( '../jion/this' )( module );


} )( );
