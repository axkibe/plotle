/*
| A user is creating a new relation.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_createRelation',
		attributes :
		{
			fromItemPath :
			{
				comment : 'the item the relation goes from',
				type : [ 'undefined', 'jion$path' ]
			},
			pan :
			{
				comment : 'starting pan when panning during creation',
				type : [ 'undefined', 'euclid_point' ]
			},
			toItemPath :
			{
				comment : 'the item the relation goes to',
				type : [ 'undefined', 'jion$path' ]
			},
			toPoint :
			{
				comment : 'the arrow destination while its floating',
				type : [ 'undefined', 'euclid_point' ]
			},
			// FUTURE make a defined state list
			relationState :
			{
				comment : 'the state of the relation creation',
				type : 'string'
			},
			startPoint :
			{
				comment : 'mouse down point on drag creation',
				type : [ 'undefined', 'euclid_point' ]
			}
		}
	};
}


var
	action_createRelation;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_createRelation = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_createRelation.prototype;


/*
| Returns true if an entity with path is affected by this action.
*/
prototype.affects =
	function(
		// path
	)
{
	return false;
};


/*
| Returns true if an entity with path is affected by this action.
*/
prototype.affects =
	function(
		path
	)
{
	return(
		path.equals( this.fromItemPath )
		|| path.equals( this.toItemPath )
	);
};


} )( );
