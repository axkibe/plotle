/*
| Measures texts.
*/


var
	font_default,
	gleam_measure,
	shell_settings;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Singleton
*/
gleam_measure =
{

	/*
	| Initialize is called once by shell
	*/
	init :
		function( canvas )
	{
		gleam_measure._cx = canvas.getContext( '2d' );

		/**/if( FREEZE ) Object.freeze( gleam_measure );
	},


	/*
	| Returns the width of text with the specified font.
	*/
	width :
		function(
			font,
			text
		)
	{
		var
			cx;

		if( shell_settings.opentype )
		{
			return font_default.getAdvanceWidth(text, font.size);
		}
		else
		{
			cx = gleam_measure._cx;

			if( cx.font !== font.css ) cx.font = font.css;

			return cx.measureText( text ).width * font.fact;
		}
	}
};



} )( );
