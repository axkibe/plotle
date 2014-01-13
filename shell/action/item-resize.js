/*
| The user is resizing an item.
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
			'ItemResize',

		unit :
			'Action',

		subclass :
			'Action.Action',

		equals :
			'primitive',

		attributes :
			{
				align :
					{
						comment :
							'alignment ( compass ) of the resize action',

						type :
							'String'
					},

				// TODO rename transient
				item :
					{
						comment :
							'the transient item while it is dragged',

						type :
							'Item'
					},

				// TODO remove
				itemPath :
					{
						comment :
							'path to the item dragged',

						type :
							'Path'
					},

				// TODO rename item
				origin :
					{
						comment :
							'the item being resized',

						type :
							'Item'
					},

				start :
					{
						comment :
							'mouseDown point on drag creation',

						type :
							'Point'
					}
			}
	};
}


} )( );
