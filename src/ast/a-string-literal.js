/*
| A string literal.
|
| FIXME rename aString
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
			'ast.aStringLiteral',
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

var
	aStringLiteral;

aStringLiteral =
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	aStringLiteral;


} )( );
