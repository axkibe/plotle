/*
| The user is dragging an item.
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
			'itemDrag',
		unit :
			'actions',
		subclass :
			'actions.action',
		equals :
			'primitive',
		attributes :
			{
				origin :
					{
						comment :
							'the item being dragged',
						type :
							'Item'
					},
				start :
					{
						comment :
							'mouse down point on drag creation',
						type :
							'point'
					},
				transItem :
					{
						comment :
							'the transient item while it is dragged',
						type :
							'Item'
					}
			}
	};
}


} )( );
