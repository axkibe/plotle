/*
| An assignment.
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
			'Assign',
		unit :
			'Code',
		attributes :
			{
				left :
					{
						comment :
							'left-hand side',
						type :
							'Expression'
					},
				right :
					{
						comment :
							'right-hand side',
						type :
							'Expression'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
