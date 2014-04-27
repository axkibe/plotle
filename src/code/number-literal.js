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
| The joobj definition.
*/
if( JOOBJ )
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
	require( '../joobj/this' )( module );

/*
| Node export.
*/
module.exports =
	NumberLiteral;


} )( );
