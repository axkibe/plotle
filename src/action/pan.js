/*
| The user is panning the background.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// mouse down point on start of scrolling
		startPoint : { type : '../gleam/point' },

		// offset
		offset : { type : '../gleam/point' },
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
		// path
	)
{
	return false;
};


} );

