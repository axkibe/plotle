/*
| The user is resizing an item.
*/


var
	action_itemResize;


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
		id : 'action_itemResize',
		attributes :
		{
			align :
			{
				comment : 'alignment ( compass ) of the resize action',
				type : 'string'
			},
			itemPath :
			{
				comment : 'the resized items path',
				type : 'jion$path'
			},
			startPoint :
			{
				comment : 'mouseDown point on drag creation',
				type : 'euclid_point'
			},
			startZone :
			{
				comment : 'zone of the item at start of action',
				type : [ 'undefined', 'euclid_rect' ]
			},
			toFontsize :
			{
				comment : 'resize changes the items fontsize to this',
				// applicatable to label items only
				type : [ 'undefined', 'number' ]
			},
			toPnw :
			{
				comment : 'resize moves the items pnw to this',
				type : [ 'undefined', 'euclid_point' ]
			},
			toPse :
			{
				comment : 'resize moves the items pse to this',
				// applicatable to zone defined items only
				type : [ 'undefined', 'euclid_point' ]
			}
		}
	};
}


var
	prototype;


if( NODE )
{
	action_itemResize = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_itemResize.prototype;


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
