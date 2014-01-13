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
| The joobj definition.
*/
if( JOOBJ )
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
							'Point'
					},

				pan :
					{
						comment :
							'pan position on start',

						type :
							'Point'
					}
			}
	};
}


} )( );
