/*
| A text glint for gleam.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// horizonal alignment
		align : { type : 'string', defaultValue : '"left"' },

		// vertical alignment
		base : { type : 'string', defaultValue : '"alphabetic"' },

		// color of the text
		color : { type : '../color', defaultValue : 'require( "../color" ).black' },

		// the font to display the text in
		font : { type : '../font/font' },

		// where to draw it
		p : { type : '../point' },

		// text to display
		text : { type : 'string' },

		// if defined, rotation in radiant
		rotate : { type : [ 'undefined', 'number' ] },
	};
}


} );
