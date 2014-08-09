/*
| A negation expression.
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
			'aNot',
		unit :
			'ast',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to negate',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


var
	aNot;

aNot =
	require( '../jion/this' )( module );


/*
| Node export.
*/
module.exports =
	aNot;


} )( );
