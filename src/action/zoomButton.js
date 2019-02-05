/*
| The user is holding the zoomIn or zoomOut button.
*/
'use strict';


tim.define( module, ( def, action_zoomButton ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// direction, +/- 1
		dir : { type : 'number' },

		// makes further zoom steps
		refire : { type : 'boolean' }
	};
}


/*
| Shortcut to create an zoom in button action.
*/
def.static.createZoom =
	function(
		dir   // direction
	)
{
/**/if( CHECK )
/**/{
/**/	if( dir !== 1 && dir !== -1 ) throw new Error( );
/**/}

	return action_zoomButton.create( 'dir', dir, 'refire', true );
};


/*
| A zoom animation finished.
*/
def.proto.finishAnimation =
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
def.proto.normalButtonDown = true;


/*
| Drag moves during selecting.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	// don't care.
};



/*
| Starts a drag.
*/
def.proto.dragStart =
	function(
		p,     // cursor point
		screen, // the screen for this operation
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	console.log( new Error( ) );
};


} );
