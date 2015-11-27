/*
| The user is panning the background.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_pan',
		attributes :
		{
			startPoint :
			{
				comment : 'mouse down point on start of scrolling',
				type : 'euclid_point'
			},
			pan :
			{
				comment : 'pan position on start',
				type : 'euclid_point'
			}
		}
	};
}


var
	action_pan;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_pan = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_pan.prototype;


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
