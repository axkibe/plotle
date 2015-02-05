/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
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
			'action_createGeneric',
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
							'string'
					},
				transItem :
					{
						comment :
							'the transient item in creation',
						type :
							'->fabricItems',
						allowsNull :
							true
					},
				model :
					{
						comment :
							'a transient item used as model',
						type :
							'->fabricItems',
						allowsNull :
							true
					},
				start :
					{
						comment :
							'mouse down point on drag creation',
						type :
							'euclid_point',
						allowsNull :
							true
					}
			}
	};
}


} )( );
