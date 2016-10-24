/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_createGeneric',
		attributes :
		{
			itemType :
			{
				comment : 'item type to be created',
				type : 'protean'
				// 'visual_note:static',
				// 'visual_label:static',
				// 'visual_portal:static'
			},
			transItem :
			{
				comment : 'the transient item in creation',
				type :
					require( '../typemaps/visualItem' )
					.concat( [ 'undefined' ] )
			},
			startPoint :
			{
				comment : 'start point of drag creation',
				type : [ 'undefined', 'euclid_point' ]
			}
		}
	};
}


var
	action_createGeneric;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_createGeneric = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_createGeneric.prototype;


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
