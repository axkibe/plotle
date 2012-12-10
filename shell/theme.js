/*
| Meshcraft default theme.
|
| Authors: Axel Kittenberger
*/


/*
| Export

*/
var theme = null;


/*
| Imports
*/
var fontPool;
var Euclid;

/*
| Capsule
*/
(function(){
"use strict";

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/*
| The default fonts
*/
fontPool.setDefaultFonts(
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

	fade :
	{
		// ms between each fading step.
		time : 50,

		// alpha reducition by each step
		step : 0.2
	},

	/*
	| Zooming settings.
	*/
	zoom :
	{
		base        : 1.1,
		min         : -15,
		max         :  15,
		firstTimer  : 200,
		repeatTimer :  50
	},

	/*
	| Standard note in space.
	*/
	note :
	{
		minWidth  :  30,
		minHeight :  30,

		newWidth  : 300,
		newHeight : 150,

		ctrlArea :
		{
			x  :   6,
			y  : -22,

			joint : // FIXME make Point object
			{
				x : 0,
				y : 0
			}
		},

		innerMargin  :
		{
			n : 4,
			e : 5,
			s : 4,
			w : 5
		},

		style :
		{
			fill :
			{
				gradient : 'askew',
				steps :
				[
					[ 0, 'rgba( 255, 255, 248, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 160, 0.955 )' ]
				]
			},

			edge :
			[
				{
					border: 1,
					width : 1,
					color : 'rgb( 255, 188, 87 )'
				},
				{
					border: 0,
					width : 1,
					color : 'black'
				}
			],

			highlight :
			[
				{
					border: 0,
					width: 3,
					color: 'rgba( 255, 183, 15, 0.5 )'
				}
			]
		},

		cornerRadius : 8
	},

	/*
	| Portal to another space.
	*/
	portal :
	{
		minWidth  :  40,
		minHeight :  40,

		newWidth  : 100,
		newHeight :  50,

		ctrlArea :
		{
			x  : -66,
			y  : -24,

			joint : // FIXME make Point object
			{
				x : 0,
				y : 0
			}
		},

		style :
		{
			fill :
			{
				gradient : 'radial',
				steps :
				[
					[ 0, 'rgba( 255, 255, 248, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 160, 0.955 )' ]
				]
			},

			edge :
			[
				{
					border: 3,
					width : 6,
					color : 'rgb( 255, 220, 128 )'
				},
				{
					border: 0,
					width : 1,
					color : 'black'
				}
			],

			highlight :
			[
				{
					border : 0,
					width  : 3,
					color  : 'rgba( 255, 183, 15, 0.5 )'
				}
			]
		}
	},

	/*
	| A Label in space.
	*/
	label :
	{
		minSize :  8,

		ctrlArea :
		{
			x  :   6,
			y  : -22,

			joint : // FIXME make Point object
			{
				x : 0,
				y : 0
			}
		},

		style :
		{
			edge :
			[
				{
					border : 0,
					width  : 1,
					color  :
					'rgba( 100, 100, 0, 0.1 )'
				}
			],

			highlight :
			[
				{
					border : 0,
					width  : 3,
					color  : 'rgba( 255, 183, 15, 0.5 )'
				}
			]
		},

		innerMargin  :
		{
			n : 1,
			e : 1,
			s : 1,
			w : 1
		},

		// offset for creation // FIXME calculate dynamically
		createOffset :
		{
			x: 27,
			y: 12
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
		main :
		{
			width      :  90,
			height     : 800,


			ellipse :
			{
				width   : 1600,
				height  : 1600
			},

			fill :
			{
				gradient : 'radial',

				steps :
				[
					[ 0, 'rgba( 255, 255,  20, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 180, 0.955 )' ]
				]
			},

			edge :
			[
				{
					border : 1,
					width  : 1,
					color  : 'rgb( 255, 94, 44 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 94, 94,  0)'
				}
			],

			buttons :
			{
				/*
				| All buttons on the main disc.
				*/
				generic :
				{
					width  : 44,
					height : 44,

					/*
					| Button is in its default state.
					*/
					normal :
					{
						fill : 'rgba( 255, 255, 240, 0.7 )',

						edge :
						[
							{
								border : 0,
								width  : 1,
								color  : 'rgba( 196, 94, 44, 0.4 )'
							}
						]
					},

					/*
					| The users pointing device is hovering over the button.
					*/
					hover :
					{
						fill : 'rgba( 255, 235, 210, 0.7 )',

						edge :
						[
							{
								border : 0,
								width  : 1,
								color  : 'rgba( 196, 94, 44, 0.4 )'
							}
						]
					},

					/*
					| This button is currently active.
					*/
					active :
					{
						fill : 'rgb( 255, 188, 88 )',

						edge :
						[
							{
								border : 0,
								width  : 1,
								color  : 'rgba( 196, 94, 44, 0.4 )'
							}
						]
					}

				},

				/*
				| Default arrow button on main disc
				*/
				normal :
				{
					pnw : new Euclid.Point(
						4,
						145
					),

					icon :
					{
						sketch : 'sketchNormalIcon',

						fill : 'black',

						edge : [
							{
								border : 0,
								width  : 1,
								color  : 'rgba( 128, 0, 0, 1 )'
							}
						]
					}
				},

				/*
				| New button on main disc
				*/
				create :
				{
					pnw : new Euclid.Point(
						17,
						194
					),

					text : 'new',

					textAnchor : new Euclid.Point(
						22,
						22
					),

					font : fontPool.get( 14, 'cm' )
				},

				/*
				| Sign up button on main disc
				*/
				signup :
				{
					pnw :
						new Euclid.Point(
							28,
							510
						),

					text :
						[
							'sign',
							'up'
						],

					textSepY :
						16,

					textAnchor :
						new Euclid.Point(
							22,
							22
						),

					font :
						fontPool.get( 13, 'cm' )
				},


				/*
				| Log in button on main disc
				*/
				login :
				{
					pnw :
						new Euclid.Point(
						17,
						560
					),

					textAnchor : new Euclid.Point(
						22,
						22
					),

					font : fontPool.get( 13, 'cm' )
				},


				/*
				| Help button on main disc
				*/
				help :
				{
					pnw : new Euclid.Point(
						4,
						610
					),

					textAnchor : new Euclid.Point(
						22,
						22
					),

					font : fontPool.get( 22, 'cm' )
				}
			}
		},

		/*
		| The creation disc.
		*/
		create : {

			width      :  166,
			height     : 1010,

			ellipse :
			{
				width   : 1700,
				height  : 1700
			},

			fill :
			{
				gradient : 'radial',

				steps :
				[
					[ 0, 'rgba( 255, 255,  20, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 205, 0.955 )' ]
				]
			},

			edge :
			[
				{
					border : 1,
					width  : 1,
					color  : 'rgb( 255, 94, 44 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 94, 94,  0)'
				}
			],

			buttons :
			{

				/*
				| All buttons on the creation disc.
				*/
				generic :
				{
					width  : 70,
					height : 70,

					/*
					| Button is in its default state.
					*/
					normal :
					{
						//fill : 'rgba( 255, 255, 240, 0.7 )',

						edge :
						[
							/*
							{
								border : 0,
								width  : 1,
								color  : 'rgba( 196, 94, 44, 0.4 )'
							}
							*/
						]
					},


					/*
					| The users pointing device is hovering over the button.
					*/
					hover :
					{
						fill : 'rgba( 255, 235, 210, 0.7 )',

						edge :
						[
							{
								border : 0,
								width  : 1,
								color  : 'rgba( 196, 94, 44, 0.4 )'
							}
						]
					},

					/*
					| This button is currently active.
					*/
					active :
					{
						fill : 'rgb( 255, 188, 88 )',

						edge :
						[
							{
								border : 0,
								width  : 1,
								color  : 'rgba( 196, 94, 44, 0.4 )'
							}
						]
					}

				},


				/*
				| Create note button.
				*/
				note :
				{
					pnw :
						new Euclid.Point(
							52,
							216
						),

					text :
						'Note',

					textAnchor :
						new Euclid.Point(
							35,
							35
						),

					font :
						fontPool.get( 16, 'cm' )
				},


				/*
				| Create label button.
				*/
				label :
				{
					pnw :
						new Euclid.Point(
							71,
							284
						),

					text :
						'Label',

					textAnchor :
						new Euclid.Point(
							35,
							35
						),

					font :
						fontPool.get( 16, 'cm' )
				},


				/*
				| Create relation button.
				*/
				relation :
				{
					pnw :
						new Euclid.Point(
							84,
							354
						),

					text :
						[
							'Rela-',
							'tion'
						],

					textAnchor :
						new Euclid.Point(
							35,
							35
						),

					textSepY :
						20,

					font :
						fontPool.get( 16, 'cm' )
				},


				/*
				| Create portal button.
				*/
				portal :
				{
					pnw :
						new Euclid.Point(
							91,
							425
						),

					text :
						'Portal',

					textAnchor :
						new Euclid.Point(
							35,
							35
						),

					font :
						fontPool.get( 16, 'cm' )
				}
			}
		}
	},


	/*
	| Dash(board)
	*/
	dash :
	{

		panel :
		{

			fill :
			{
				gradient : 'radial',

				steps :
				[
					[ 0, 'rgba( 255, 255,  20, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 180, 0.955 )' ]
				]
			},

			edge :
			[
				{
					border : 1,
					width  : 1,
					color  : 'rgb( 255, 94, 44 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 94, 94,  0)'
				}
			]
		},

		help :
		{
			fill :
			{
				gradient : 'radial',

				steps : [
					[ 0, 'rgba(255, 255,  20, 0.955 )' ],
					[ 1, 'rgba(255, 255, 255, 0.955 )' ]
				]
			},

			edge :
			[
				{
					border : 1,
					width  : 1,
					color  : 'rgb( 255, 94, 44 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 94, 94,  0 )'
				}
			]
		},


		button :
		{
			fill :
			{
				gradient : 'horizontal',
				steps :
				[
					[0, 'rgba( 255, 237, 210, 0.5 )' ],
					[1, 'rgba( 255, 185, 81,  0.5 )' ]
				]
			},

			edge :
			[
				{
					border :   1,
					width  : 1.5,
					color  : 'rgb( 255, 141, 66 )'
				},
				{
					border :  0,
					width  :  1,
					color  : 'rgb( 94,  94,  0 )'
				}
			]
		},


		buttonHover :
		{
			fill : 'rgb( 255, 188, 88 )',
			edge :
			[
				{
					border : 1,
					width  : 2,
					color  : 'rgb( 255, 188, 87 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 128, 128, 0 )'
				}
			]
		},


		buttonFocus :
		{
			fill :
			{
				gradient : 'horizontal',
				steps :
				[
					[0, 'rgba( 255, 237, 210, 0.5 )' ],
					[1, 'rgba( 255, 185, 81,  0.5 )' ]
				]
			},

			edge :
			[
				{
					border : 1,
					width  : 2,
					color  : 'rgb( 255, 99, 188 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},


		buttonHofoc :
		{
			fill : 'rgb( 255, 188, 88 )',
			edge :
			[
				{
					border : 1,
					width  : 2,
					color  : 'rgb( 255, 99, 188 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},


		chat :
		{
			fill : 'rgba( 255, 255, 180, 0.7 )',

			edge :
			[
				{
					border :  0,
					width  :  1,
					color  : 'rgba( 184,  64,  0, 0.7 )'
				}
			]
		},


		input :
		{
			fill : 'white',

			edge :
			[
				{
					border : 1,
					width  : 1.5,
					color  : 'rgb( 255, 188, 87 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},


		inputFocus :
		{
			fill : 'white',

			edge :
			[
				{
					border : 1,
					width  : 2,
					color  : 'rgb( 255, 99, 188 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},


		boxes :
		{
			edge :
			[
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},

		checkbox :
		{
			fill : 'white',

			edge :
			[
				{
					border : 1,
					width  : 1.5,
					color  : 'rgb( 255, 188, 87 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},

		checkboxHover :
		{
			fill : 'white',

			edge :
			[
				{
					border : 1,
					width  : 2,
					color  : 'rgb( 255, 188, 87 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 128, 128, 0 )'
				}
			]
		},

		checkboxFocus :
		{
			fill : 'white',

			edge :
			[
				{
					border : 1,
					width  : 2,
					color  : 'rgb( 255, 99, 188 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},

		checkboxHofoc :
		{
			fill : 'white',

			edge :
			[
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},

		checkboxCheck :
		{
			fill : 'black',
			edge : [ ]
		}
	},


	switchpanel :
	{
		dimensions :
		{
			a    : 120,
			b    :  null // calculated below
		},


		style :
		{
			fill :
			{
				gradient : 'radial',
				steps :
				[
					[ 0, 'rgba( 255, 255,  20, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 180, 0.955 )' ]
				]
			},

			edge :
			[
				{
					border : 1,
					width  : 1,
					color  : 'rgb( 255, 94, 44 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 94, 94,  0 )'
				}
			]
		},

		label :
		{
			font : fontPool.get( 14, 'cm' )
		},

		message :
		{
			font : fontPool.get( 12, 'cm' )
		},

		space :
		{
			fill : 'rgba( 255, 255, 255, 0.8 )',
			edge :
			[
				{
					border : 0,
					width  : 0.5,
					color  : 'black'
				}
			]
		},


		current  :
		{
			fill : 'rgba( 255, 255, 255, 0.15 )',
			edge :
			[
				{ border: 0, width : 0.5, color : 'black' }
			]
		},


		curhov  :
		{
			fill : 'rgba( 255, 188, 88, 0.3 )',

			edge :
			[
				{
					border : 0,
					width  : 0.5,
					color  : 'black'
				}
			]
		},

		hover :
		{
			fill : 'rgba( 255, 188, 88, 0.8 )',

			edge :
			[
				{
					border : 0,
					width  : 0.5,
					color  : 'black'
				}
			]
		}
	},


	// ellpse menu
	ellipseMenu :
	{
		dimensions :
		{
			a1    :  28,
			b1    :  null, // calculated below (24)
			a2    :  90,
			b2    :  null, // calculated below
			slice :  0.82
		},

		font : fontPool.get( 12, 'cm' ),

		style :
		{
			edge :
			[
				{
					border : 1,
					width  : 1,
					color  : 'rgb( 255, 94, 44 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 94, 94,  0 )'
				}
			],

			fill :
			{
				gradient : 'radial',

				steps :
				[
					[ 0, 'rgba( 255, 255, 140, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 200, 0.955 )' ]
				]
			}
		},

		slice :
		{
			fill :
			{
				gradient : 'horizontal',

				steps :
				[
					[ 0, 'rgba( 255, 255, 200, 0.9 )' ],
					[ 1, 'rgba( 255, 255, 205, 0.9 )' ]
				]
			},

			edge :
			[
				{
					border : 1,
					width  : 1,
					color  : 'rgb( 255, 200, 105 )'
				},
				{
					border : 0,
					width  : 0.7,
					color  : 'black'
				}
			]
		},


		highlight :
		{
			fill : 'rgb( 255, 188, 88 )',

			edge :
			[
				{
					border : 0,
					width  : 0.4,
					color  : 'black'
				}
			]
		}
	},


	// selection
	selection :
	{
		style :
		{
			fill   : 'rgba( 243, 203, 255, 0.9 )',

			edge :
			[
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		}
	},


	// scrollbar
	scrollbar :
	{
		style :
		{
			fill : 'rgb( 255, 188, 87 )',

			edge :
			[
				{
					border : 0,
					width  : 1,
					color  : 'rgb( 221, 154, 52 )'
				}
			]
		},

		// width
		strength :  8,

		// ellipse cap
		ellipseA    :  4,
		ellipseB    :  3,

		// minimum height
		minSize  : 12,

		// vertical distance from border of note
		vdis : 5
	},


	// size of resize handles
	handle :
	{
		maxSize   : 12,

		cdistance : 12,
		edistance : 12,

//		cdistance :  8,
//		edistance : 11,

		style :
		{
			fill : 'rgba( 255, 240, 150, 0.9 )',
			edge :
			[
				{
					border : 0,
					width  : 1,
					color  : 'rgba( 255, 180, 110, 0.9 )'
				}
			]
		}
	},


	relation :
	{
		style :
		{
			fill : 'rgba( 255, 225, 40, 0.5 )',

			edge :
			[
				{
					border : 0,
					width  : 3,
					color  : 'rgba( 255, 225, 80, 0.4 )'
				},
				{
					border : 0,
					width  : 1,
					color  : 'rgba( 200, 100, 0,  0.8 )'
				}
			],

			highlight :
			[
				{
					border : 0,
					width  : 3,
					color  : 'rgba( 255, 183, 15, 0.5 )'
				}
			]
		},

		innerMargin :
		{
			n : 1,
			e : 1,
			s : 1,
			w : 1
		},

		// offset for creation // FIXME calculate dynamically
		createOffset :
		{
			x : 44,
			y : 12
		}
	}
};

var odim = theme.ellipseMenu.dimensions;
var c30 = Math.cos(Math.PI / 6);
odim.b1 = Math.round(odim.a1 * c30);
odim.b2 = Math.round(odim.b1 / odim.a1 * odim.a2);

var swidim = theme.switchpanel.dimensions;
swidim.b = Math.round(swidim.a * c30);

theme.itemmenu = theme.ellipseMenu;

} ) ();
