/*
| Case statements in abstract syntax trees.
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
			'ast.astCase',
		attributes :
			{
				block :
					{
						comment :
							'the statement',
						type :
							'ast.astBlock'
					}
			},
		node :
			true,
		twig :
			'->expression',
	};
}


/*
| Node export.
*/
module.exports = require( '../jion/this' )( module );


} )( );
