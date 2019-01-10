/*
| A zooming grid in a display.
|
| First the fill is drawn then the border.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the grid zooming factor
		grid : { type : 'number' },

		// the offset of the (major) grid
		offset : { type : '../point' },

		// the total size of the grid
		size : { type : '../size' },

		// the distance of the (major) grid point
		spacing : { type : '../point' },
	};
}


} );
