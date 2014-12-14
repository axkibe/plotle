/*
| A comment in an abstract syntax tree.
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
			'ast_comment',
		attributes :
			{
				content :
					{
						comment :
							'comment content',
						type :
							'Array'
					},
			}
	};
}


require( '../jion/this' )( module );


} )( );
