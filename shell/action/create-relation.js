/*
| A user is creating a new relation.
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
			'CreateRelation',

		unit :
			'Action',

		subclass :
			'Action.Action',

		primitiveEquals :
			true,

		attributes :
			{
				fromItemPath :
					{
						comment :
							'the item the relation goes from',

						type :
							'Path'
					},

				// TODO remove
				itemPath :
					{
						comment :
							'TODO',

						type :
							'String'
					},

				/*
				item :
					{
						comment :
							'the transient item in creation',

						type :
							'Item'
					},
				*/


				pan :
					{
						comment :
							'starting pan when panning during creation',

						type :
							'Point'
					},

				toItemPath :
					{
						comment :
							'the item the relation goes to',

						type :
							'Path'
					},

				toPoint :
					{
						comment :
							'the arrow destination while its floating',

						type :
							'Point'
					},

				// FIXME rename
				// FIXME make a defined state list
				relationState :
					{
						comment :
							'the state of the relation creation',

						type :
							'String'
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
