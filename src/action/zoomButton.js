/*
| The user is holding the zoomIn or zoomOut button.
*/
'use strict';


tim.define( module, 'action_zoomButton', ( def, action_zoomButton ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		dir :
		{
			// direction, +/- 1
			type : 'number'
		},
		refire :
		{
			// make further zoom steps
			type : 'boolean'
		}
	};
}


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


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


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns true if an entity with path is affected by this action.
*/
def.func.affects =
	function(
		path
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
