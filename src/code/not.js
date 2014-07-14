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
			'Not',
		unit :
			'Code',
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
	Not;

Not =
	require( '../jion/this' )( module );


/*
| Node export.
*/
module.exports =
	Not;


} )( );
