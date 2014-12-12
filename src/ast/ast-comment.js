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
			'ast_astComment',
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
