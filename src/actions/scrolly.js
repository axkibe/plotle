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
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'actions.scrollY',
		subclass :
			'actions.action',
		equals :
			'primitive',
		attributes :
			{
				itemPath :
					{
						comment :
							'path to the item being scrolled',
						type :
							'jion.path'
					},
				start :
					{
						comment :
							'mouse down point on start of scrolling',
						type :
							'euclid.point'
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
