/*
| Optional checks in abstract syntax trees.
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
			'ast.astCheck',
		attributes :
			{
				'block' :
					{
						comment :
							'the code block',
						type :
							'ast.astBlock'
					}
			},
		node :
			true
	};
}


require( '../jion/this' )( module );


} )( );
