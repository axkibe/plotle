/*
| The user is holding the zoomIn or zoomOut button.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_zoomButton',
		attributes :
		{
			dir :
			{
				comment : '+/- 1',
				type : 'number'
			},
			refire :
			{
				comment : 'make further zoom steps',
				type : 'boolean'
			}
		}
	};
}


var
	action_zoomButton;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_zoomButton = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_zoomButton.prototype;



/*
| Shortcut to create an zoom in button action.
*/
action_zoomButton.createZoom =
	function(
		dir
	)
{
	var
		action;

/**/if( CHECK )
/**/{
/**/	if( dir !== 1 && dir !== -1 ) throw new Error( );
/**/}

	action =
		action_zoomButton.create(
			'dir', dir,
			'refire', true
		);

	return action;
};


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
| A zoom animation finished.
*/
prototype.finishAnimation =
	function( )
{
	if( this.refire )
	{
		root.changeSpaceTransformCenter( this.dir );

		return true;
	}

	return false;
};


/*
| 'Normal' button ought to be down during this action.
*/
prototype.normalButtonDown = true;


} )( );
