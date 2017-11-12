/*
| The user is scrolling a note.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_scrolly',
		attributes :
		{
			scrollPath :
			{
				comment : 'path to the item or widget being scrolled',
				type : 'jion$path'
			},
			startPoint :
			{
				comment : 'mouse down point on start of scrolling',
				type : 'gleam_point'
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
	action_scrolly;


/*
| Capsule
*/
( function( ) {
'use strict';


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
	return this.scrollPath.equals( path );
};


/*
| 'Normal' button ought to be down during this action.
*/
prototype.normalButtonDown = true;


} )( );
