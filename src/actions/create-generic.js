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
			'actions.createGeneric',
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
							'Object', // FUTURE 'items.*',
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
							'euclid_point',
						allowsNull :
							true
					}
			}
	};
}


} )( );
