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
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'ItemResize',
		unit :
			'actions',
		subclass :
			'actions.action',
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
				transItem :
					{
						comment :
							'the transient item while it is dragged',
						type :
							'Object' // FUTURE items.*
					},
				origin :
					{
						comment :
							'the item being resized',
						type :
							'Object' // FUTURE items.*
					},
				start :
					{
						comment :
							'mouseDown point on drag creation',
						type :
							'euclid.point'
					}
			}
	};
}


} )( );
