/*
| The user is dragging an item.
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
			'action_itemDrag',
		equals :
			'primitive',
		attributes :
			{
				origin :
					{
						comment :
							'the item being dragged',
						type :
							'->fabricItems'
					},
				start :
					{
						comment :
							'mouse down point on drag creation',
						type :
							'euclid_point'
					},
				transItem :
					{
						comment :
							'the transient item while it is dragged',
						type :
							'->fabricItems'
					}
			}
	};
}


} )( );
