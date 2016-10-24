/*
| A user has selected 'new' on the main disc
| but not yet decided for any item.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_create',
		attributes :
		{
			pan :
			{
				comment : 'starting pan when panning during creation',
				type : [ 'undefined', 'euclid_point' ]
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
	action_create;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_create = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_create.prototype;


/*
| Mark it as a creation action.
*/
prototype.isCreate = true;


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


} )( );
