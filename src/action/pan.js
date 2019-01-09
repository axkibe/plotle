/*
| The user is panning the background.
*/
'use strict';


tim.define( module, ( def ) => {


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


} );
