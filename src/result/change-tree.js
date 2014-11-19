/*
| Combined result of a changeTree call from a change or changeRay
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'result.changeTree',
		attributes :
			{
				reaction :
					{
						comment :
							'changes may alter themselves on changing a tree',
						type :
							[ 'ccot.change', 'ccot.changeRay' ]
					},
				tree :
					{
						comment :
							'the changed path',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
