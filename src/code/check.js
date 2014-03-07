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
			'Check',
		unit :
			'Code',
		attributes :
			{
				code :
					{
						comment :
							'the code',
						type :
							'Block'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
