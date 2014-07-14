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
| The jion definition.
*/
if( JION )
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
	require( '../jion/this' )( module );


} )( );
