/*
| An users action in the making.
|
| Creating a new Note.
| Creating a new Label.
| Creating a new Portal.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'CreateGeneric',

		unit :
			'Action',

		subclass :
			'Action.Action',

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
							'Item',

						allowsNull :
							true
					},

				model :
					{
						comment :
							'a transient item used as model',

						type :
							'Item',

						allowsNull :
							true
					},

				start :
					{
						comment :
							'mouse down point on drag creation',

						type :
							'Point',

						allowsNull :
							true
					}
			}
	};
}


} )( );
