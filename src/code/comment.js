/*
| A file to be generated.
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
			'Comment',
		unit :
			'Code',
		attributes :
			{
				content :
					{
						comment :
							'comment content',
						type :
							'Array'
					},
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
