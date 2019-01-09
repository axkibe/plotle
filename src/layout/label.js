/*
| A label.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// font of the text
		font : { type : [ 'undefined', '../gleam/font' ] },

		// vertical distance of newline
		newline : { type : [ 'undefined', 'number' ] },

		// designed position
		pos : { type : '../gleam/point' },

		// the label text
		text : { type : 'string' },
	};
}


} );
