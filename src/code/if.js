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
			'If',
		unit :
			'Code',
		attributes :
			{
				then :
					{
						comment :
							'the then code',
						type :
							'Block'
					},
				elsewise :
					{
						comment :
							'the else wise',
						type :
							'Block',
						defaultValue :
							'null'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
