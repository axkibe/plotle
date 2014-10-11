/*
| A number literal.
|
| FUTURE remove the Literal in name
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
			'ast.astNumberLiteral',
		node :
			true,
		attributes :
			{
				'number' :
					{
						comment :
							'the number',
						type :
							'Number'
					}
			}
	};
}


module.exports =
	require( '../jion/this' )( module );


} )( );
