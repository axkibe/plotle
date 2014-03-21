/*
| Code for for-in loops.
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
			'ForIn',
		unit :
			'Code',
		attributes :
			{
				variable :
					{
						comment :
							'the loop variable',
						type :
							'String'
					},
				object :
					{
						comment :
							'the object to iterate over',
						type :
							'Term'
					},
				block :
					{
						comment :
							'the for block',
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
