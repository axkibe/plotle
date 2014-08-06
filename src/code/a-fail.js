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
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'aFail',
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
	require( '../jion/this' )( module );


} )( );
