/*
| Tests if left is an instance of right.
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
			'ast_instanceof',
		attributes :
			{
				left :
					{
						comment :
							'left expression',
						type :
							'->astExpression'
					},
				right :
					{
						comment :
							'right expression',
						type :
							'->astExpression'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
