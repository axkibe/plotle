/*
| The user is scrolling a note.
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
			'action_scrollY',
		attributes :
			{
				itemPath :
					{
						comment :
							'path to the item being scrolled',
						type :
							'jion_path'
					},
				start :
					{
						comment :
							'mouse down point on start of scrolling',
						type :
							'euclid_point'
					},
				startPos :
					{
						comment :
							'position of the scrollbar on start of scrolling',
						type :
							'number'
					}
			}
	};
}


} )( );
