/*
| A number literal.
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
			'NumberLiteral',
		unit :
			'Code',
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

var
	NumberLiteral;

NumberLiteral =
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	NumberLiteral;


} )( );
