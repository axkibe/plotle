/*
| For-in loops in abstract syntax trees.
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
			'ast.aForIn',
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
							'ast.aBlock'
					}
			},
		node :
			true
	};
}


module.exports = require( '../jion/this' )( module );


} )( );
