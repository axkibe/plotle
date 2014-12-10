/*
| Meshcraft default theme.
|
| FIXME call shell_theme
| FUTURE remove and put it all to gruga
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
	| Factor to add to the bottom of font height
	*/
	bottombox :
		0.25,

	/*
	| Zooming settings.
	*/
	zoom :
	{
		base :
			1.1,

		min :
			-15,

		max :
			15,

		firstTimer :
			200,

		repeatTimer :
			50
	},

	/*
	| Standard note in space.
	*/
	note :
	{
		minWidth :
			30,

		minHeight :
			30,

		innerMargin  :
			euclid_margin.create(
				'n', 4,
				'e', 5,
				's', 4,
				'w', 5
			),

		style :
			'note',

		cornerRadius :
			8,

		// default fontsize
		fontsize :
			13
	},

	/*
	| Portal to another space.
	*/
	portal :
	{
		minWidth :
			40,

		minHeight :
			40,

		style :
			'portal',

		/*
		| input fields on the portal
		*/
		input :
		{
			style :
				'portalInput',

			rounding :
				3,

			pitch :
				5
		},

		/*
		| moveto button on the portal
		*/
		moveTo :
		{
			style :
				'portalButton',

			width :
				80,

			height :
				22,

			rounding :
				11
		}
	},


	/*
	| A label in space.
	*/
	label :
	{
		minSize : 8,

		style : 'label',

		innerMargin  :
			euclid_margin.create(
				'n', 1,
				'e', 1,
				's', 1,
				'w', 1
			)
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
			width :
				100,

			height :
				800,

			ellipse :
			{
				width :
					1600,

				height :
					1600
			},

			fill :
			{
				gradient :
					'radial',

				steps :
				[
					[
						0,
						'rgba( 255, 255,  20, 0.955 )'
					],
					[
						1,
						'rgba( 255, 255, 180, 0.955 )'
					]
				]
			},

			edge :
			[
				{
					border :
						1,

					width :
						1,

					color :
						'rgb( 255, 94, 44 )'
				},

				{
					border :
						0,

					width :
						1,

					color :
						'rgb( 94, 94,  0)'
				}
			]
		},

		/*
		| The creation disc.
		*/
		createDisc :
		{

			width :
				176,

			height :
				1010,

			ellipse :
			{
				width :
					1700,

				height :
					1700
			},

			fill :
			{
				gradient :
					'radial',

				steps :
				[
					[
						0,
						'rgba( 255, 255,  20, 0.955 )'
					],
					[
						1,
						'rgba( 255, 255, 205, 0.955 )'
					]
				]
			},

			edge :
			[
				{
					border :
						1,

					width :
						1,

					color :
						'rgb( 255, 94, 44 )'
				},
				{
					border :
						0,

					width :
						1,

					color :
						'rgb( 94, 94,  0)'
				}
			]
		}
	},


	/*
	| Forms
	*/
	forms :
	{
		style :
		{
			fill : {
				gradient :
					'askew',

				steps :
				[
					[ 0, 'rgba( 255, 255, 248, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 210, 0.955 )' ]
				]
			},

			edge : [ ]
		}
	},


	/*
	| Selection
	*/
	selection :
	{
		style :
		{
			fill :
				'rgba( 243, 203, 255, 0.9 )',

			edge :
			[
				{
					border :
						0,

					width :
						1,

					color :
						'black'
				}
			]
		}
	},


	/*
	| Scrollbar
	*/
	scrollbar :
	{
		style :
		{
			fill :
				'rgb( 255, 188, 87 )',

			edge :
			[
				{
					border :
						0,

					width :
						1,

					color :
						'rgb( 221, 154, 52 )'
				}
			]
		},

		// width
		strength :
			8,

		// ellipse cap
		ellipseA :
			4,

		ellipseB :
			3,

		// minimum height
		minSize :
			12,

		// vertical distance from border of note
		vdis :
			5
	},


	/*
	| Size of resize handles
	*/
	handle :
	{
		maxSize :
			12,

		cdistance :
			12,

		edistance :
			12,

		style :
		{
			fill :
				'rgba( 255, 240, 150, 0.9 )',

			edge :
			[
				{
					border :
						0,

					width :
						1,

					color :
						'rgba( 255, 180, 110, 0.9 )'
				}
			]
		}
	},


	/*
	| Relation
	*/
	relation :
	{
		style :
		{
			fill :
				'rgba( 255, 225, 40, 0.5 )',

			edge :
			[
				{
					border :
						0,

					width :
						3,

					color :
						'rgba( 255, 225, 80, 0.4 )'
				},
				{
					border :
						0,

					width :
						1,

					color :
						'rgba( 200, 100, 0,  0.8 )'
				}
			],

			highlight :
			[
				{
					border :
						0,

					width :
						3,

					color :
						'rgba( 255, 183, 15, 0.5 )'
				}
			]
		},

		innerMargin :
			euclid_margin.create(
				'n', 1,
				'e', 1,
				's', 1,
				'w', 1
			),

		// offset for creation // FIXME calculate dynamically
		spawnOffset :
		{
			x : 44,

			y : 12
		}
	}
};

} ) ();
