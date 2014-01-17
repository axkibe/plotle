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
| The joobj definition.
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

		equals :
			'primitive',

		attributes :
			{
				fromItemPath :
					{
						comment :
							'the item the relation goes from',

						type :
							'Path'
					},

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
							'Point',

						allowNull :
							true,

						defaultVal :
							'null'
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
							'Point',

						allowNull :
							true,

						defaultVal :
							'null'
					}
			}
	};
}


} )( );
