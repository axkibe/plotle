/*
| A text glint for gleam.
*/
'use strict';


tim.define( module, 'gleam_glint_text', ( def, gleam_glint_text ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		font :
		{
			// the font to display the text in
			type : 'gleam_font'
		},
		p :
		{
			// where to draw it
			type : 'gleam_point'
		},
		text :
		{
			// text to display
			type : 'string'
		},
		rotate :
		{
			// if defined rotation in radiant
			type : [ 'undefined', 'number' ]
		}
	};
}


} );
