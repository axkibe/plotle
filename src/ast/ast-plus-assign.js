/*
| Ast plus assignment ( += )
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
			'ast.astPlusAssign',
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
	astPlusAssign;


astPlusAssign =
module.exports =
	require( '../jion/this' )( module );

astPlusAssign.prototype.astIsExpression = true;


} )( );
