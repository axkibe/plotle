/*
| The user is dragging an item.
*/
'use strict';


tim.define( module, 'action_dragItems', ( def, action_dragItems ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		moveBy :
		{
			// drags the items by this x/y
			type : [ 'undefined', 'gleam_point' ]
		},
		itemPaths :
		{
			// the paths of the items to drag
			type : [ 'undefined', 'tim.js/pathList' ]
		},
		startPoint :
		{
			// mouse down point on drag creation
			type : 'gleam_point'
		}
	};
}


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
	const paths = this.itemPaths;

	for( let a = 0, pLen = paths.length; a < pLen; a++ )
	{
		const pa = paths.get( a );

		if( pa.equals( path ) ) return true;
	}

	return false;
};


/*
| 'Normal' button ought to be down during this action.
*/
def.func.normalButtonDown = true;


} );
