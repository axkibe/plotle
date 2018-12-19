/*
| A zooming grid in a display.
|
| First the fill is drawn then the border.
*/
'use strict';


tim.define( module, ( def, gleam_glint_paint ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// TODO
		grid : { type : 'number' },

		// TODO
		offset : { type : '../point' },

		// TODO
		size : { type : '../size' },

		// TODO
		spacing : { type : '../point' },
	};
}


} );
