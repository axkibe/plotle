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
		name :
			'aStringLiteral',
		unit :
			'Code',
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
