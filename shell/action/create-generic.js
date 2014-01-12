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
| The Joobj definition.
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

		primitiveEquals :
			true,

		attributes :
			{
				itemType :
					{
						comment :
							'item type to be created',

						type :
							'String'
					},

				item :
					{
						comment :
							'the transient item in creation',

						type :
							'Item'
					},

				origin :
					{
						comment :
							'TODO',

						type :
							'Item'
					},

				start :
					{
						comment :
							'mouse down point on drag creation',

						type :
							'Point'
					}
			}
	};
}


} )( );
