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
				chgX :
					{
						comment :
							'change or change ray',
						type :
							[ 'ccot.change', 'ccot.changeRay' ],
						defaultValue :
							undefined
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
