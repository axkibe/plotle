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
			'ast_astCase',
		attributes :
			{
				block :
					{
						comment :
							'the statement',
						type :
							'ast_block'
					}
			},
		// ray contains multiple alternatives for the same case block.
		ray :
			// '->expression', FUTURE
			[ ]
	};
}


require( '../jion/this' )( module );


} )( );
