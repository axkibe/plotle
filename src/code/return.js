/*
| Code for returns statements.
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
			'Return',
		unit :
			'Code',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to return',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
