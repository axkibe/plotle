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
				// TODO remove
				itemPath :
					{
						comment :
							'path to the item dragged',

						type :
							'Path'
					},

				start :
					{
						comment :
							'mouse down point on drag creation',

						type :
							'Point'
					},

				// TODO rename transient
				item :
					{
						comment :
							'the transient item while it is dragged',

						type :
							'Item'
					},

				// TODO rename item
				origin :
					{
						comment :
							'the item being dragged',

						type :
							'Item'
					}
			}
	};
}


} )( );
