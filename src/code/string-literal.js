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
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	StringLiteral;


} )( );
