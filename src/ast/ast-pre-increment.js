/*
| Pre increments for abstract syntax trees.
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
			'ast.astPreIncrement',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to pre increment',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


var
	astPreIncrement;


astPreIncrement =
module.exports =
	require( '../jion/this' )( module );

astPreIncrement.prototype.astIsExpression = true;


} )( );
