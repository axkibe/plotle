/*
| The user is resizing an item.
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
			'action_itemResize',
		equals :
			'primitive',
		attributes :
			{
				align :
					{
						comment :
							'alignment ( compass ) of the resize action',
						type :
							'string'
					},
				transItem :
					{
						comment :
							'the transient item while it is dragged',
						type :
							'->fabricItems'
					},
				origin :
					{
						comment :
							'the item being resized',
						type :
							'->fabricItems'
					},
				start :
					{
						comment :
							'mouseDown point on drag creation',
						type :
							'euclid_point'
					}
			}
	};
}


} )( );
