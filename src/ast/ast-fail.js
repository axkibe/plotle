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
			'ast.astFail',
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


require( '../jion/this' )( module );


} )( );
