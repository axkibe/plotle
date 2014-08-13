/*
| The user is panning the background.
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
		name :
			'Pan',
		unit :
			'Action',
		subclass :
			'Action.Action',
		equals :
			'primitive',
		attributes :
			{
				start :
					{
						comment :
							'mouse down point on start of scrolling',
						type :
							'euclid.point'
					},
				pan :
					{
						comment :
							'pan position on start',
						type :
							'euclid.point'
					}
			}
	};
}


} )( );
