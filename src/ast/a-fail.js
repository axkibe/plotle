/*
| Failures (error exceptions) for abstract syntax trees.
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
			'ast.aFail',
		attributes :
			{
				message :
					{
						comment :
							'the error message expression',
						type :
							'Object',
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../jion/this' )( module );


} )( );
