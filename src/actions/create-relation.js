/*
| A user is creating a new relation.
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
			'actions_createRelation',
		equals :
			'primitive',
		attributes :
			{
				fromItemPath :
					{
						comment :
							'the item the relation goes from',
						type :
							'jion_path'
					},
				pan :
					{
						comment :
							'starting pan when panning during creation',
						type :
							'euclid_point',
						defaultValue :
							null
					},
				toItemPath :
					{
						comment :
							'the item the relation goes to',
						type :
							'jion_path'
					},
				toPoint :
					{
						comment :
							'the arrow destination while its floating',
						type :
							'euclid_point',
						defaultValue :
							null
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
							'euclid_point',
						defaultValue :
							null
					}
			}
	};
}


} )( );
