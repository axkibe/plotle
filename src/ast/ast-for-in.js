/*
| For-in loops in abstract syntax trees.
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
			'ast_astForIn',
		attributes :
			{
				variable :
					{
						comment :
							'the loop variable',
						type :
							'String'
					},
				object :
					{
						comment :
							'the object expression to iterate over',
						type :
							'Object'
					},
				block :
					{
						comment :
							'the for block',
						type :
							'ast_block'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
