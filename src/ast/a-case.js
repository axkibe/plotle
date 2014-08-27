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
		name :
			'aCase',
		unit :
			'ast',
		attributes :
			{
				block :
					{
						comment :
							'the statement',
						type :
							'ast.aBlock'
					}
			},
		node :
			true,
		twig :
			'->expression',
	};
}


var
	aCase;

aCase = require( '../jion/this' )( module );


/*
| Node export.
*/
module.exports = aCase;


} )( );
