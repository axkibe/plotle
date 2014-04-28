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
| The joobj definition.
*/
if( JOOBJ )
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
	require( '../joobj/this' )( module );


/*
| Node export.
*/
module.exports =
	Not;


} )( );
