/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
*/


var
	action_createGeneric;


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
	return{
		id : 'action_createGeneric',
		attributes :
		{
			itemType :
			{
				comment : 'item type to be created',
				// FUTURE make list of possibilities
				type : 'string'
			},
			transItem :
			{
				comment : 'the transient item in creation',
				type :
					require( '../typemaps/visualItems' )
					.concat( [ 'undefined' ] )
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
	prototype;


if( NODE )
{
	action_createGeneric = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_createGeneric.prototype;


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
