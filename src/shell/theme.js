/*
| Meshcraft default theme.
|
| FIXME call shell_settings
| FIXME remove and put it all to gruga
*/


/*
| Export

*/
var
	theme,
	euclid_border,
	euclid_color,
	euclid_margin,
	gradient_askew,
	gradient_colorStop,
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
	| Factor to add to the bottom of font height
	*/
	bottombox : 0.25,

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
		minWidth : 30,
		minHeight : 30,
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
		minWidth : 40,
		minHeight : 40,

		/*
		| input fields on the portal
		*/
		input :
		{
			rounding : 3,
			pitch : 5
		},

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
	| A label in space.
	*/
	label :
	{
		minSize : 8,
		innerMargin  : euclid_margin.create( 'n', 1, 'e', 1, 's', 1, 'w', 1 )
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
	| Form
	*/
	form :
	{
		style :
		{
			fill :
				gradient_askew.create(
					'ray:append',
					gradient_colorStop.create(
						'offset', 0,
						'color', euclid_color.rgb( 255, 255, 248 )
					),
					'ray:append',
					gradient_colorStop.create(
						'offset', 1,
						'color', euclid_color.rgb( 255, 255, 210 )
					)
				),
			border : null
		}
	},


	/*
	| Selection
	*/
	selection :
	{
		style :
		{
			fill : euclid_color.rgba( 243, 203, 255, 0.9 ),
			border : euclid_border.simpleBlack
		}
	},


	/*
	| Scrollbar
	*/
	scrollbar :
	{
		style :
		{
			fill : euclid_color.rgb( 255, 188, 87 ),
			border :
				euclid_border.create(
					'color', euclid_color.rgb( 221, 154, 52 )
				)
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
		edistance : 12,
		style :
		{
			fill : euclid_color.rgba( 255, 240, 150, 0.9 ),
			border :
				euclid_border.create(
					'color', euclid_color.rgba( 255, 180, 110, 0.9 )
				)
		}
	},


	/*
	| Relation
	*/
	relation :
	{
		innerMargin :
			euclid_margin.create( 'n', 1, 'e', 1, 's', 1, 'w', 1 ),

		// offset for creation // FUTURE calculate dynamically
		spawnOffset :
		{
			x : 44,
			y : 12
		}
	}
};

} )( );
