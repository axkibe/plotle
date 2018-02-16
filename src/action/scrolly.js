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
		// path to the item or widget being scrolled
		scrollPath : { type : 'tim.js/path' },

		// mouse down point on start of scrolling
		startPoint : { type : 'gleam_point' },

		// position of the scrollbar on start of scrolling
		startPos : { type : 'number' },
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
