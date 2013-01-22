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
( function( ) {
"use strict";

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


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
	bottombox :
		0.25,

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
	| Alpha level of hovering on remove operations.
	*/
	removeAlpha :
		0.55,

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
		{
			n :
				4,

			e :
				5,

			s :
				4,

			w :
				5
		},

		style :
		{
			fill :
			{
				gradient :
					'askew',

				steps :
				[
					[ 0, 'rgba( 255, 255, 248, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 160, 0.955 )' ]
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
						'rgb( 255, 188, 87 )'
				},
				{
					border :
						0,

					width :
						1,

					color :
						'black'
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

		cornerRadius : 8
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
		{
			fill :
			{
				gradient :
					'radial',

				steps :
				[
					[ 0, 'rgba( 255, 255, 248, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 160, 0.955 )' ]
				]
			},

			edge :
			[
				{
					border :
						3,

					width :
						6,

					color :
						'rgb( 255, 220, 128 )'
				},
				{
					border :
						0,

					width :
						1,

					color :
						'black'
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
		}
	},


	/*
	| A Label in space.
	*/
	label :
	{
		minSize :  8,

		style :
		{
			edge :
			[
				{
					border :
						0,

					width :
						1,

					color :
						'rgba( 100, 100, 0, 0.1 )'
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

		innerMargin  :
		{
			n :
				1,

			e :
				1,

			s :
				1,

			w :
				1
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
			],

			buttons :
			{
				/*
				| All buttons on the main disc.
				*/
				generic :
				{
					width :
						44,

					height :
						44,

					/*
					| Button is in its default state.
					*/
					normal :
					{
						fill :
							'rgba( 255, 255, 240, 0.7 )',

						edge :
						[
							{
								border :
									0,

								width :
									1,

								color :
									'rgba( 196, 94, 44, 0.4 )'
							}
						]
					},

					/*
					| The users pointing device is hovering over the button.
					*/
					hover :
					{
						fill :
							'rgba( 255, 235, 210, 0.7 )',

						edge :
						[
							{
								border :
									0,

								width :
									1,

								color :
									'rgba( 196, 94, 44, 0.4 )'
							}
						]
					},

					/*
					| This button is currently active.
					*/
					active :
					{
						fill :
							'rgb( 255, 188, 88 )',

						edge :
						[
							{
								border :
									0,

								width :
									1,

								color :
									'rgba( 196, 94, 44, 0.4 )'
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
						120
					),

					icon :
					{
						sketch :
							'sketchNormalIcon',

						fill :
							'black',

						edge :
						[
							{
								border :
									0,

								width :
									1,

								color :
									'rgba( 128, 0, 0, 1 )'
							}
						]
					}
				},

				/*
				| New button on main disc
				*/
				create :
				{
					pnw :
						new Euclid.Point(
							20,
							169
						),

					text :
						'new',

					textAnchor :
						new Euclid.Point(
							22,
							22
						),

					font :
						fontPool.get( 14, 'cm' )
				},

				/*
				| Remove button on main disc
				*/
				remove :
				{
					pnw :
						new Euclid.Point(
							32,
							218
						),

					icon :
					{
						sketch :
							'sketchRemoveIcon',

						fill :
							'#ff0000',

						edge :
						[
							{
								border :
									0,

								width :
									1,

								color :
									'rgba( 128, 0, 0, 1 )'
							}
						]
					}
				},

				/*
				| Space button on main disc
				*/
				space :
				{
					width :
						28,

					height :
						290,

					pnw :
						new Euclid.Point(
							0,
							170
						),

					offset :
						new Euclid.Point(
							-60,
							0
						),

					text :
						'meshcraft:home',

					textAnchor :
						new Euclid.Point(
							11,
							145
						),

					textRotate :
						- Math.PI / 2,

					font :
						fontPool.get( 12, 'cm' )
				},

				/*
				| User button on main disc
				*/
				user :
				{
					width :
						24,

					height :
						180,

					pnw :
						new Euclid.Point(
							0,
							440
						),

					offset :
						new Euclid.Point(
							-70,
							0
						),

					text :
						'visitor-1',

					textAnchor :
						new Euclid.Point(
							11,
							90
						),

					textRotate :
						- Math.PI / 2,

					font :
						fontPool.get( 12, 'cm' )
				},

				/*
				| Log in button on main disc
				*/
				login :
				{
					pnw :
						new Euclid.Point(
							30,
							535
						),

					text :
						[
							'log',
							'in'
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
				| Sign up button on main disc
				*/
				signup :
				{
					pnw :
						new Euclid.Point(
							19,
							585
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
				| Help button on main disc
				*/
				help :
				{
					pnw :
						new Euclid.Point(
							4,
							635
						),

					text :
						'?',

					textAnchor :
						new Euclid.Point(
							22,
							22
						),

					font :
						fontPool.get( 22, 'cm' )
				}
			}
		},

		/*
		| The creation disc.
		*/
		create :
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
			],

			/*
			| The creation discs buttons
			*/
			buttons :
			{

				/*
				| All buttons on the creation disc.
				*/
				generic :
				{
					width :
						70,

					height :
						70,

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
								border :
									0,

								width :
									1,

								color :
									'rgba( 196, 94, 44, 0.4 )'
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
							62,
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
							81,
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
							94,
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
							101,
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
					[ 1, 'rgba( 255, 255, 160, 0.955 )' ]
					/*
					[ 0, 'rgba( 255, 255,  20, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 180, 0.955 )' ]
					*/
				]
			},

			edge : [ ]
		},

		/*
		| default input field style
		| TODO move this into 'style'
		*/
		input :
		{
			fill :
				'white',

			edge :
			[
				{
					border :
						1,

					width :
						1.5,

					color :
						'rgb( 255, 188, 87 )'
				},
				{
					border :
						0,

					width :
						1,

					color :
						'black'
				}
			]
		},


		/*
		| default input focused field style
		*/
		inputFocus :
		{
			fill :
				'white',

			edge :
			[
				{
					border :
						1,

					width :
						2,

					color :
						'rgb( 255, 99, 188 )'
				},
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
					border : 0,
					width  : 1,
					color  : 'black'
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
					border : 0,
					width  : 1,
					color  : 'rgb( 221, 154, 52 )'
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
					border : 0,
					width  : 1,
					color  : 'rgba( 255, 180, 110, 0.9 )'
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
		{
			n :
				1,

			e :
				1,

			s :
				1,

			w :
				1
		}
	}
};

theme.itemmenu =
	theme.ellipseMenu;

} ) ();
