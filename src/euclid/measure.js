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
var euclid;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Singleton
*/
var measure =
euclid.measure =
{

	/*
	| Initialize is called once by shell
	*/
	init :
		function( canvas )
	{
		measure._cx =
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
			cx;

		cx = measure._cx;

		if( cx.font !== font.css )
		{
			cx.font = font.css;
		}

		return cx.measureText( text ).width;
	}
};


} )( );
