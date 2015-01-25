/*
| Ast plus assignment ( += )
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
			'ast_plusAssign',
		attributes :
			{
				left :
					{
						comment :
							'left-hand side',
						type :
							'->astExpression'
					},
				right :
					{
						comment :
							'right-hand side',
						type :
							'->astExpression'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
