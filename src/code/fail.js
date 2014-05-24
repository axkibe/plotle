/*
| Code for optional checks.
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
			'Fail',
		unit :
			'Code',
		attributes :
			{
				message :
					{
						comment :
							'the error message expression',
						type :
							'Object',
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
