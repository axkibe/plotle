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
			direction :
			{
				comment : '"in" or "out"',
				type : 'string'
			},
			_timer :
			{
				comment : 'the interval timer ID for continueing',
				type : [ 'undefined' , 'number' ]
			}
		},
		init : [ ]
	};
}


var
	action_zoomButton,
	shell_settings,
	system;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	onZoomTime,
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
action_zoomButton.createZoomIn =
	function( )
{
	return(
		action_zoomButton.create(
			'direction', 'in'
		)
	);
};


/*
| Shortcut to create an zoom in button action.
*/
action_zoomButton.createZoomOut =
	function( )
{
	return(
		action_zoomButton.create(
			'direction', 'out'
		)
	);
};


/*
| A zoom button interval timer fired
*/
onZoomTime =
	function( )
{
	root.changeSpaceTransformCenter( this.direction === 'in' ? 1 : -1 );
};



/*
| Initializer.
*/
prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( this.direction !== 'in' && this.direction !== 'out' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !this._timer )
	{
		this._timer =
			system.setInterval(
				shell_settings.animationZoomStepTime,
				onZoomTime.bind( this )
			);
	}
};


/*
| Cancels the timer for this zoomButton action.
*/
prototype.cancelTimer =
	function( )
{
	system.cancelInterval( this._timer );
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
| 'Normal' button ought to be down during this action.
*/
prototype.normalButtonDown = true;


} )( );
