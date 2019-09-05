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

		// where to draw it
		p : { type : '../point' },

		// color to draw the text with
		color : { type : '../color', defaultValue : 'require( "../color" ).black' },

		// the token to display
		token : { type : '../font/token' },

		// if defined, rotation in radiant
		rotate : { type : [ 'undefined', 'number' ] },
	};
}

} );
