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
	euclid_margin,
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
	| Zooming settings.
	*/
	zoom :
	{
		base : 1.1,
		min : -15,
		max : 15
	},

	/*
	| Standard note in space.
	*/
	note :
	{
		innerMargin  :
			euclid_margin.create( 'n', 4, 'e', 5, 's', 4, 'w', 5 ),
		cornerRadius : 8,
		// default fontsize
		fontsize : 13
	},

	/*
	| Portal to another space.
	*/
	portal :
	{

		/*
		| moveto button on the portal
		*/
		moveTo :
		{
			width : 80,
			height : 22,
			rounding : 11
		}
	},


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
		style :
		{
		},
		// width
		strength : 8,
		// ellipse cap
		ellipseA : 4,
		ellipseB : 3,
		// minimum height
		minSize : 12,
		// vertical distance from border of note
		vdis : 5
	},


	/*
	| Size of resize handles
	*/
	handle :
	{
		maxSize : 12,
		cdistance : 12,
		edistance : 12
	},
};

} )( );
