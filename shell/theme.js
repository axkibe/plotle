/*
| Meshcraft default theme.
|
| Authors: Axel Kittenberger
*/


/*
| Export

*/
var theme =
	null;


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
		},

		/*
		| Style of the input fields on the portal
		*/
		input :
		{
			edge :
			[
				{
					border :
						0,

					width :
						1,

					color :
						'rgb( 255, 188, 87 )'
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
			]
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
					/*
					[ 0, 'rgba( 255, 255, 248, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 160, 0.955 )' ]
					*/
					[ 0, 'rgba( 255, 255, 248, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 210, 0.955 )' ]
					/*
					[ 0, 'rgba( 255, 255,  20, 0.955 )' ],
					[ 1, 'rgba( 255, 255, 180, 0.955 )' ]
					*/
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
		},

		// offset for creation // FIXME calculate dynamically
		createOffset :
		{
			x :
				44,
			y :
				12
		}
	},


	styles :
	{
		mainButton :
		{
			/*
			| Widget is in its default state.
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
			| The users pointing device is hovering over the widget.
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
			| Widget has focus
			*/
			focus :
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
			},

			/*
			| Widget has focus and hover.
			*/
			hofoc :
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
		| TODO
		*/
		createButton :
		{
			/*
			| Widget is in its default state.
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
			| The users pointing device is hovering over the widget
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
			focus :
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
			},

			/*
			| This button is currently active.
			*/
			hofoc :
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
		| The default arrow for the normal button.
		*/
		iconNormal :
		{
			normal :
			{
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
		| The red criss-cross for the remove button
		*/
		iconRemove :
		{
			normal :
			{
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
		| TODO
		*/
		genericButton :
		{
			/*
			| TODO
			*/
			normal :
			{

				fill :
				{
					gradient :
						'horizontal',

					steps :
					[
						[
							0,
							'rgba( 255, 237, 210, 0.5 )'
						],
						[
							1,
							'rgba( 255, 185, 81,  0.5 )'
						]
					]
				},

				edge :
				[
					{
						border :
							1,

						width :
							1.5,

						color :
							'rgb( 255, 141, 66 )'
					},
					{
						border :
							0,

						width  :
							1,

						color :
							'rgb( 94,  94,  0 )'
					}
				]
			},

			/*
			| TODO
			*/
			hover :
			{
				fill :
					'rgb( 255, 188, 88 )',

				edge :
				[
					{
						border :
							1,

						width :
							2,

						color :
							'rgb( 255, 188, 87 )'
					},
					{
						border :
							0,

						width :
							1,

						color :
							'rgb( 128, 128, 0 )'
					}
				]
			},

			/*
			| TODO
			*/
			focus :
			{
				fill :
				{
					gradient :
						'horizontal',

					steps :
					[
						[
							0,
							'rgba( 255, 237, 210, 0.5 )'
						],
						[
							1,
							'rgba( 255, 185, 81,  0.5 )'
						]
					]
				},

				edge :
				[
					{
						border :
							1,

						width  :
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
			},


			hofoc :
			{
				fill :
					'rgb( 255, 188, 88 )',

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
		| portal buttons on moveto form
		*/
		portalButton :
		{
			/*
			| Widget is in its default state.
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
			| The users pointing device is hovering over the widget.
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
			| Widget has focus
			*/
			focus :
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
			},

			/*
			| Widget has focus and hover.
			*/
			hofoc :
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
		| TODO
		*/
		checkbox :
		{
			/*
			| TODO
			*/
			normal :
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

			hover :
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
							'rgb( 255, 188, 87 )'
					},
					{
						border :
							0,

						width :
							1,

						color :
							'rgb( 128, 128, 0 )'
					}
				]
			},

			focus :
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
			},

			hofoc :
			{
				fill :
					'white',

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

		// TODO make this an icon
		checkboxCheck :
		{
			normal :
			{
				fill :
					'black',

				edge :
					[ ]
			}
		},

		/*
		| default input field style
		| TODO move this into 'style'
		*/
		input :
		{
			normal :
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
			focus :
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
		}
	}
};

theme.itemmenu =
	theme.ellipseMenu;

} ) ();
