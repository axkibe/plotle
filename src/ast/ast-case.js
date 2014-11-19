/*
| Case statements in abstract syntax trees.
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


require( '../jion/this' )( module );


} )( );
