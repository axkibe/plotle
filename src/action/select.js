/*
| The user is selecting stuff via a rectangle.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_select',
		attributes :
		{
			startPoint :
			{
				comment : 'point at start of operation',
				type : [ 'undefined', 'euclid_point' ]
			},
			toPoint :
			{
				comment : 'point the rectangle goes to',
				type : [ 'undefined', 'euclid_point' ]
			}
		}
	};
}


var
	action_select;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_select = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_select.prototype;


/*
| Returns true if an entity with path is affected by this action.
*/
prototype.affects =
	function(
		path
	)
{
	var
		item;

	item = root.getPath( path );

	return false;
};


} )( );
