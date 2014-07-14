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
		name :
			'BooleanLiteral',
		unit :
			'Code',
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
	BooleanLiteral;

BooleanLiteral =
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	BooleanLiteral;


} )( );
