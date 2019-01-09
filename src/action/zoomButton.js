/*
| The user is holding the zoomIn or zoomOut button.
*/
'use strict';


tim.define( module, ( def, action_zoomButton ) => {


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
| Returns true if an entity with path is affected by this action.
*/
def.func.affectsItem =
	function(
		item
	)
{
	return false;
};


/*
| A zoom animation finished.
*/
def.func.finishAnimation =
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
def.func.normalButtonDown = true;


} );
