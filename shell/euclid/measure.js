/*
|
| Measures texts.
|
| Authors: Axel Kittenberger
|
*/


/*
| Exports
*/
var Euclid;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Singleton
*/
var Measure =
Euclid.Measure =
{

	/*
	| Initialize is called once by shell
	*/
	init :
		function( canvas )
	{
		Measure._cx =
			canvas.getContext( '2d' );
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
			cx =
				Measure._cx;

		if(
			cx.foont !== font.css
		)
		{
			cx.font =
				font.css;
		}

		return cx.measureText( text ).width;
	}
};


} )( );
