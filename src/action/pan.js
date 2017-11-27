/*
| The user is panning the background.
*/
'use strict';


tim.define( module, 'action_pan', ( def, action_pan ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		startPoint :
		{
			// mouse down point on start of scrolling
			type : 'gleam_point'
		},
		offset :
		{
			// offset
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
		// path
	)
{
	return false;
};


} );
