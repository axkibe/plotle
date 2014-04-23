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
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'StringLiteral',
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
	StringLiteral;

StringLiteral =
	require( '../joobj/this' )( module );

/*
| Node export.
*/
module.exports =
	StringLiteral;


} )( );
