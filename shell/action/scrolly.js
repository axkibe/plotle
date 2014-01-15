/*
| The user is scrolling a note.
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
			'ScrollY',

		unit :
			'Action',

		subclass :
			'Action.Action',

		equals :
			'primitive',

		attributes :
			{
				itemPath :
					{
						comment :
							'path to the item being scrolled',

						type :
							'Path'
					},

				start :
					{
						comment :
							'mouse down point on start of scrolling',

						type :
							'Point'
					},

				startPos :
					{
						comment :
							'position of the scrollbar on start of scrolling',

						type :
							'Number'
					}
			}
	};
}


} )( );
