/*
| Measures texts.
|
| FIXME move this to font object
*/


var
	font_default,
	gleam_measure;


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
	| Returns the width of text with the specified font.
	*/
	width :
		function(
			font,
			text
		)
	{
		return font_default.getAdvanceWidth(text, font.size);
	}
};



} )( );
