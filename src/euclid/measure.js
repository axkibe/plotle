/*
| Measures texts.
*/


var
	euclid_measure;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Singleton
*/
euclid_measure =
{

	/*
	| Initialize is called once by shell
	*/
	init :
		function( canvas )
	{
		euclid_measure._cx =
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

		cx = euclid_measure._cx;

		if( cx.font !== font.css )
		{
			cx.font = font.css;
		}

		return cx.measureText( text ).width;
	}
};


// FIXME freeze

} )( );
