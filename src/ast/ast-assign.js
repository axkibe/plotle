/*
| An assignment in an abstract syntax tree.
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
	return{
		id :
			'ast.astAssign',
		attributes :
			{
				left :
					{
						comment :
							'left-hand side',
						type :
							'Object'
					},
				right :
					{
						comment :
							'right-hand side',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


var
	astAssign;


astAssign =
module.exports =
	require( '../jion/this' )( module );


astAssign.prototype.astIsExpression = true;


} )( );
