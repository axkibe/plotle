/*
| The user is scrolling a note.
*/
'use strict';


tim.define( module, 'action_scrolly', ( def, action_scrolly ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		scrollPath :
		{
			// path to the item or widget being scrolled
			type : 'tim$path'
		},
		startPoint :
		{
			// mouse down point on start of scrolling
			type : 'gleam_point'
		},
		startPos :
		{
			// position of the scrollbar on start of scrolling
			type : 'number'
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
	return this.scrollPath.equals( path );
};


/*
| 'Normal' button ought to be down during this action.
*/
def.func.normalButtonDown = true;


} );
