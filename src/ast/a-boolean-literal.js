/*
| A boolean literal.
| ( true or false )
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
			'ast.aBooleanLiteral',
		node :
			true,
		attributes :
			{
				'boolean' :
					{
						comment :
							'the boolean',
						type :
							'Boolean'
					}
			}
	};
}

var
	aBooleanLiteral;

aBooleanLiteral =
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	aBooleanLiteral;


} )( );
