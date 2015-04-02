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
		id : 'action_createRelation',
		attributes :
		{
			fromItemPath :
			{
				comment : 'the item the relation goes from',
				type : 'jion_path',
				defaultValue : 'undefined'
			},
			pan :
			{
				comment : 'starting pan when panning during creation',
				type : 'euclid_point',
				defaultValue : 'undefined'
			},
			toItemPath :
			{
				comment : 'the item the relation goes to',
				type : 'jion_path',
				defaultValue : 'undefined'
			},
			toPoint :
			{
				comment : 'the arrow destination while its floating',
				type : 'euclid_point',
				defaultValue : 'undefined'
			},
			// FUTURE make a defined state list
			relationState :
			{
				comment : 'the state of the relation creation',
				type : 'string'
			},
			start :
			{
				comment : 'mouse down point on drag creation',
				type : 'euclid_point',
				defaultValue : 'undefined'
			}
		}
	};
}


} )( );
