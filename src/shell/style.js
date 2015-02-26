/*
| Styles.
*/


var
	shell_accent,
	shell_style;

/*
| Capsule
*/
( function( ) {
'use strict';


shell_style = { };


shell_style.styles =
{
	mainButton :
	{
		/*
		| Widget is in its default state.
		*/
		normal :
		{
			fill : 'rgba( 255, 255, 240, 0.7 )',

			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgba( 196, 94, 44, 0.4 )'
				}
			]
		},

		/*
		| The users pointing device is hovering over the widget.
		*/
		hover :
		{
			fill : 'rgba( 255, 235, 210, 0.7 )',

			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgba( 196, 94, 44, 0.4 )'
				}
			]
		},

		/*
		| Widget has focus
		*/
		focus :
		{
			fill : 'rgb( 255, 188, 88 )',

			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgba( 196, 94, 44, 0.4 )'
				}
			]
		},

		/*
		| Widget has focus and hover.
		*/
		hofoc :
		{
			fill : 'rgb( 255, 188, 88 )',

			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgba( 196, 94, 44, 0.4 )'
				}
			]
		}
	},

	/*
	| Buttons on the create disc.
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
					border : 0,

					width : 1,

					color : 'rgba( 196, 94, 44, 0.4 )'
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
					border : 0,

					width : 1,

					color : 'rgba( 196, 94, 44, 0.4 )'
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
			fill : 'black',

			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgba( 128, 0, 0, 1 )'
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
			fill : '#ff0000',

			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgba( 128, 0, 0, 1 )'
				}
			]
		}
	},


	/*
	| Default button.
	*/
	genericButton :
	{
		/*
		| Widget is in its default state.
		*/
		normal :
		{

			fill : 'rgba( 255, 255, 240, 0.7 )',

			edge :
			[
				{
					border : 1,

					width : 2,

					color : 'rgba( 196, 94, 44, 0.7 )'
				}
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
					border : 1,

					width  : 2,

					color : 'rgba( 196, 94, 44, 0.7 )'
				}
			]
		},

		/*
		| The widget got currently the focus.
		*/
		focus :
		{
			fill : 'rgba( 255, 255, 240, 0.7 )',

			edge :
			[
				{
					border : 2,

					width : 1.5,

					color : 'rgb( 255, 99, 188 )'
				},
				{
					border : 1,

					width : 2,

					color : 'rgba( 196, 94, 44, 0.7 )'
				}
			]
		},


		hofoc :
		{
			fill :
				'rgba( 255, 235, 210, 0.7 )',

			edge :
			[
				{
					border : 2,

					width : 1.5,

					color : 'rgb( 255, 99, 188 )'
				},
				{
					border : 1,

					width : 2,

					color : 'rgba( 196, 94, 44, 0.7 )'
				}
			]
		}
	},




	/*
	| Standard look of a note.
	*/
	note :
	{
		normal :
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
					border : 1,

					width : 1,

					color : 'rgb( 255, 188, 87 )'
				},
				{
					border : 0,

					width : 1,

					color : 'black'
				}
			]
		},

		highlight :
		{
			edge :
			[
				{
					border : 0,

					width : 3,

					color : 'rgba( 255, 183, 15, 0.5 )'
				}
			]
		}
	},

	/*
	| Standard look of a portal.
	*/
	portal :
	{
		normal :
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
					border : 3,

					width : 6,

					color : 'rgb( 255, 220, 128 )'
				},
				{
					border : 0,

					width : 1,

					color : 'black'
				}
			]
		},

		highlight :
		{
			edge :
			[
				{
					border : 0,

					width : 3,

					color : 'rgba( 255, 183, 15, 0.5 )'
				}
			]
		}
	},

	/*
	| Input fields on portals.
	*/
	portalInput :
	{
		normal :
		{
			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgb( 255, 219, 165 )'
				}
			]
		}
	},


	/*
	| Portal buttons on moveto form and in the portal
	*/
	portalButton :
	{
		/*
		| Widget is in its default state.
		*/
		normal :
		{
			fill : 'rgba( 255, 237, 210, 0.5 )',

			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgb( 255, 141, 66 )'
				}
			]
		},

		/*
		| The users pointing device is hovering over the widget.
		*/
		hover :
		{
			fill : 'rgba( 255, 188, 88, 0.7 )',

			edge :
			[
				{
					border : 0,

					width : 1.5,

					color : 'rgb( 255, 141, 66 )'
				}
			]
		},

		/*
		| Widget has focus.
		*/
		focus :
		{
			fill : 'rgba( 255, 237, 210, 0.5 )',

			edge :
			[
				{
					border : 1,

					width  : 1.5,

					color : 'rgb( 255, 99, 188 )'
				}
			]
		},

		/*
		| Widget has focus and hover.
		*/
		hofoc :
		{
			fill : 'rgba( 255, 188, 88, 0.7 )',

			edge :
			[
				{
					border : 1,

					width  : 1.5,

					color : 'rgb( 255, 99, 188 )'
				}
			]
		}
	},


	/*
	| Standard look of a label.
	*/
	label :
	{
		normal :
		{
			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'rgba( 100, 100, 0, 0.1 )'
				}
			]
		},

		highlight :
		{
			edge :
			[
				{
					border : 0,

					width : 3,

					color : 'rgba( 255, 183, 15, 0.5 )'
				}
			]
		}
	},


	/*
	| Default checkbox.
	*/
	checkbox :
	{
		/*
		| Widget is in its default state.
		*/
		normal :
		{
			fill : 'white',

			edge :
			[
				{
					border : 1,

					width : 1.5,

					color : 'rgb( 255, 188, 87 )'
				},
				{
					border : 0,

					width : 1,

					color : 'black'
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
					border : 1,

					width : 2,

					color : 'rgb( 255, 188, 87 )'
				},
				{
					border : 0,

					width : 1,

					color : 'rgb( 128, 128, 0 )'
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
					border : 1,

					width : 2,

					color : 'rgb( 255, 99, 188 )'
				},
				{
					border : 0,

					width : 1,

					color : 'black'
				}
			]
		},

		hofoc :
		{
			fill : 'white',

			edge :
			[
				{
					border : 0,

					width : 1,

					color : 'black'
				}
			]
		}
	},

	/*
	| FIXME make this an icon
	*/
	checkboxCheck :
	{
		normal :
		{
			fill : 'black',

			edge : [ ]
		}
	},



	/*
	| Default input field style.
	*/
	input :
	{
		normal :
		{
			fill : 'white',

			edge :
			[
				{
					border : 1,

					width : 1.5,

					color : 'rgb( 255, 188, 87 )'
				},
				{
					border : 0,

					width : 1,

					color : 'black'
				}
			]
		},

		/*
		| Default input focused field style.
		*/
		focus :
		{
			fill : 'white',

			edge :
			[
				{
					border : 1,

					width : 2,

					color : 'rgb( 255, 99, 188 )'
				},
				{
					border : 0,

					width : 1,

					color : 'black'
				}
			]
		}
	}
};


/*
| Gets a style by its name.
*/
shell_style.getStyle =
	function(
		name,
		accent
	)
{
	var
		style;

	style = shell_style.styles[ name ];

	if( !style )
	{
		throw new Error(
			'Invalid style name: ' + name
		);
	}

	switch( accent )
	{
		case shell_accent.NORMA :

			style = style.normal;

			break;

		case shell_accent.HOVER :

			style = style.hover;

			break;

		case shell_accent.FOCUS :

			style = style.focus;

			break;

		case shell_accent.HOFOC :

			style = style.hofoc;

			break;

		default :

			if( style[ accent ] )
			{
				style = style[ accent ];
			}
			else
			{
				throw new Error( );
			}
	}

	if( !style )
	{
		throw new Error( );
	}

	return style;
};

} )( );
