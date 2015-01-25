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
			'ast_return',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to return',
						type :
							'->astExpression'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
