/*
| A code term to be generated
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
			'Term',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				// FIXME check if necessary
				'term' :
					{
						comment :
							'the term',
						type :
							'String'
					}
			}
	};
}


/*
| Node export.
*/
module.exports =
	require( '../joobj/this' )( module );


} )( );
