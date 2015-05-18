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
			transItem :
			{
				comment : 'the transient item while it is dragged',
				type : require( '../typemaps/visualItems' )
			},
			origin :
			{
				comment : 'the item being resized',
				type : require( '../typemaps/visualItems' )
			},
			start :
			{
				comment : 'mouseDown point on drag creation',
				type : 'euclid_point'
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
	return this.origin.path.equals( path );
};


} )( );
