/*
| A code block to be generated
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
			'Block',
		unit :
			'Code',
		attributes :
			{
				content :
					{
						comment :
							'block content',
						type :
							'Array'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
