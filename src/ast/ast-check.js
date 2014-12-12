/*
| Optional checks in abstract syntax trees.
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
			'ast_astCheck',
		attributes :
			{
				'block' :
					{
						comment :
							'the code block',
						type :
							'ast_astBlock'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
