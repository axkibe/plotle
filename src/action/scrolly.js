/*
| The user is scrolling a note.
*/


var
	action_scrolly;


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
		id : 'action_scrolly',
		attributes :
		{
			itemPath :
			{
				comment : 'path to the item being scrolled',
				type : 'jion$path'
			},
			startPoint :
			{
				comment : 'mouse down point on start of scrolling',
				type : 'euclid_point'
			},
			startPos :
			{
				comment : 'position of the scrollbar on start of scrolling',
				type : 'number'
			}
		}
	};
}


var
	prototype;


if( NODE )
{
	action_scrolly = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_scrolly.prototype;


/*
| Returns true if an entity with path is affected by this action.
*/
prototype.affects =
	function(
		path
	)
{
	return this.itemPath.equals( path );
};


} )( );
