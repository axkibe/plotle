/*
| A string literal.
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
			'ast.astString',
		node :
			true,
		attributes :
			{
				'string' :
					{
						comment :
							'the literal',
						type :
							'String'
					}
			}
	};
}


module.exports =
	require( '../jion/this' )( module );


} )( );
