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
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'CreateRelation',
		unit :
			'actions',
		subclass :
			'actions.action',
		equals :
			'primitive',
		attributes :
			{
				fromItemPath :
					{
						comment :
							'the item the relation goes from',
						type :
							'path'
					},
				pan :
					{
						comment :
							'starting pan when panning during creation',
						type :
							'euclid.point',
						defaultValue :
							null
					},
				toItemPath :
					{
						comment :
							'the item the relation goes to',
						type :
							'path'
					},
				toPoint :
					{
						comment :
							'the arrow destination while its floating',
						type :
							'euclid.point',
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
							'euclid.point',
						defaultValue :
							null
					}
			}
	};
}


} )( );
