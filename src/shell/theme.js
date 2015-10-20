/*
| Meshcraft default theme.
|
| FIXME remove and put it all to gruga
*/


/*
| Export

*/
var
	theme,
	shell_fontPool;

/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The default fonts
*/
shell_fontPool.setDefaultFonts(
	'DejaVuSans,sans-serif',
	'DejaVuSansBold,sans-serif'
);


/*
| The whole theme
*/
theme =
{
	/*
	| The disc menues.
	*/
	disc :
	{
		/*
		| The main disc.
		*/
		mainDisc :
		{
			width : 100,

			height : 800,

			ellipse :
			{
				width : 1600,
				height : 1600
			}
		},

		/*
		| The creation disc.
		*/
		createDisc :
		{

			width : 176,
			height : 1010,
			ellipse :
			{
				width : 1700,
				height : 1700
			}
		}
	},


	/*
	| Scrollbar
	*/
	scrollbar :
	{
		// width
		strength : 8,
		// ellipse cap
		ellipseA : 4,
		ellipseB : 3,
		// minimum height
		minSize : 12,
		// vertical distance from border of note
		vdis : 5
	}

};


} )( );
