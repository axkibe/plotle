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
			'actions.itemDrag',
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
							'Object' // FUTURE items.*
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
							'Object' // FUTURE items.*
					}
			}
	};
}


} )( );
