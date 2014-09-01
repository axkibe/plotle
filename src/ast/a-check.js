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
			'ast.aCheck',
		attributes :
			{
				'block' :
					{
						comment :
							'the code block',
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
