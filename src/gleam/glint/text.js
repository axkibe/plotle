/*
| A text glint for gleam.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the font to display the text in
		font : { type : '../font' },

		// where to draw it
		p : { type : '../point' },

		// text to display
		text : { type : 'string' },

		// if defined rotation in radiant
		rotate : { type : [ 'undefined', 'number' ] },
	};
}


} );
