/*
| A file to be generated
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
			'File',
		unit :
			'Code',
		attributes :
			{
				header :
					{
						comment :
							'header comment',
						type :
							'Comment'
					},
				capsule :
					{
						comment :
							'the capsule',
						type :
							'Block',
						defaultValue :
							'undefined'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
