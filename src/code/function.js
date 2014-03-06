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
				args :
					{
						comment :
							'function arguments',
						type :
							'Array'
					},
				block :
					{
						comment :
							'function code',
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
