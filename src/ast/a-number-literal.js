/*
| A number literal.
|
| FIXME remove the Literal in name
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
			'aNumberLiteral',
		unit :
			'ast',
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
	aNumberLiteral;

aNumberLiteral =
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports = aNumberLiteral;


} )( );
