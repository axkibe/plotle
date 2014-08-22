/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
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
			'createGeneric',
		unit :
			'actions',
		subclass :
			'actions.action',
		equals :
			'primitive',
		attributes :
			{
				itemType :
					{
						comment :
							'item type to be created',
						// FIXME make list of possibilities
						type :
							'String'
					},
				transItem :
					{
						comment :
							'the transient item in creation',
						type :
							'item',
						allowsNull :
							true
					},
				model :
					{
						comment :
							'a transient item used as model',
						type :
							'Object', // FUTURE visual.*
						allowsNull :
							true
					},
				start :
					{
						comment :
							'mouse down point on drag creation',
						type :
							'euclid.point',
						allowsNull :
							true
					}
			}
	};
}


} )( );
