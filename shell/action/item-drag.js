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
| The Joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'ItemDrag',

		unit :
			'Action',

		subclass :
			'Action.Action',

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
							'Point'
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
