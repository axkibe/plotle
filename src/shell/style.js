/*
| Styles.
|
| FIXME steps
*/


var
	euclid_border,
	euclid_color,
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
			fill : euclid_color.rgba( 255, 255, 240, 0.7 ),

			border :
				euclid_border.create(
					'color', euclid_color.rgba( 196, 94, 44, 0.4 )
				)
		},

		/*
		| The users pointing device is hovering over the widget.
		*/
		hover :
		{
			fill : euclid_color.rgba( 255, 235, 210, 0.7 ),

			border :
				euclid_border.create(
					'color', euclid_color.rgba( 196, 94, 44, 0.4 )
				)
		},

		/*
		| Widget has focus
		*/
		focus :
		{
			fill : euclid_color.rgb( 255, 188, 88 ),

			border :
				euclid_border.create(
					'color', euclid_color.rgba( 196, 94, 44, 0.4 )
				)
		},

		/*
		| Widget has focus and hover.
		*/
		hofoc :
		{
			fill : euclid_color.rgb( 255, 188, 88 ),

			border :
				euclid_border.create(
					'color', euclid_color.rgba( 196, 94, 44, 0.4 )
				)
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
			fill : null,

			edge : null
		},

		/*
		| The users pointing device is hovering over the widget
		*/
		hover :
		{
			fill : euclid_color.rgba( 255, 235, 210, 0.7 ),

			edge :
			[
				{
					border : 0,
					width  : 1,
					color  : euclid_color.rgba( 196, 94, 44, 0.4 )
				}
			]
		},

		/*
		| This button is currently active.
		*/
		focus :
		{
			fill : euclid_color.rgb( 255, 188, 88 ),

			edge :
			[
				{
					border : 0,
					width : 1,
					color : euclid_color.rgba( 196, 94, 44, 0.4 )
				}
			]
		},

		/*
		| This button is currently active.
		*/
		hofoc :
		{
			fill : euclid_color.rgb( 255, 188, 88 ),

			edge :
			[
				{
					border : 0,
					width : 1,
					color : euclid_color.rgba( 196, 94, 44, 0.4 )
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
			fill : euclid_color.black,

			edge :
			[
				{
					border : 0,
					width : 1,
					color : euclid_color.rgb( 128, 0, 0 )
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
			fill : euclid_color.rgb( 255, 0, 0 ),

			edge :
			[
				{
					border : 0,
					width : 1,
					color : euclid_color.rgb( 128, 0, 0 )
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

			fill : euclid_color.rgba( 255, 255, 240, 0.7 ),

			edge :
			[
				{
					border : 1,
					width : 2,
					color : euclid_color.rgba( 196, 94, 44, 0.7 )
				}
			]
		},

		/*
		| The users pointing device is hovering over the widget
		*/
		hover :
		{
			fill : euclid_color.rgba( 255, 235, 210, 0.7 ),

			edge :
			[
				{
					border : 1,
					width  : 2,
					color : euclid_color.rgba( 196, 94, 44, 0.7 )
				}
			]
		},

		/*
		| The widget got currently the focus.
		*/
		focus :
		{
			fill : euclid_color.rgba( 255, 255, 240, 0.7 ),

			edge :
			[
				{
					border : 2,
					width : 1.5,
					color : euclid_color.rgb( 255, 99, 188 )
				},
				{
					border : 1,
					width : 2,
					color : euclid_color.rgba( 196, 94, 44, 0.7 )
				}
			]
		},


		hofoc :
		{
			fill : euclid_color.rgba( 255, 235, 210, 0.7 ),

			edge :
			[
				{
					border : 2,
					width : 1.5,
					color : euclid_color.rgb( 255, 99, 188 ),
				},
				{
					border : 1,
					width : 2,
					color : euclid_color.rgba( 196, 94, 44, 0.7 )
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
			// FIXME jionize
			fill :
			{
				gradient : 'askew',

				steps :
				[
					[ 0, euclid_color.rgba( 255, 255, 248, 0.955 ) ],
					[ 1, euclid_color.rgba( 255, 255, 160, 0.955 ) ]
				]
			},

			edge :
			[
				{
					border : 1,
					width : 1,
					color : euclid_color.rgb( 255, 188, 87 )
				},
				{
					border : 0,
					width : 1,
					color : euclid_color.black
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
					color : euclid_color.rgba( 255, 183, 15, 0.5 )
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
					[ 0, euclid_color.rgba( 255, 255, 248, 0.955 ) ],
					[ 1, euclid_color.rgba( 255, 255, 160, 0.955 ) ]
				]
			},

			edge :
			[
				{
					border : 3,
					width : 6,
					color : euclid_color.rgb( 255, 220, 128 )
				},
				{
					border : 0,
					width : 1,
					color : euclid_color.black
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
					color : euclid_color.rgba( 255, 183, 15, 0.5 )
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
					color : euclid_color.rgb( 255, 219, 165 )
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
			fill : euclid_color.rgba( 255, 237, 210, 0.5 ),

			edge :
			[
				{
					border : 0,
					width : 1,
					color : euclid_color.rgb( 255, 141, 66 )
				}
			]
		},

		/*
		| The users pointing device is hovering over the widget.
		*/
		hover :
		{
			fill : euclid_color.rgba( 255, 188, 88, 0.7 ),

			edge :
			[
				{
					border : 0,
					width : 1.5,
					color : euclid_color.rgb( 255, 141, 66 )
				}
			]
		},

		/*
		| Widget has focus.
		*/
		focus :
		{
			fill : euclid_color.rgba( 255, 237, 210, 0.5 ),

			edge :
			[
				{
					border : 1,
					width  : 1.5,
					color : euclid_color.rgb( 255, 99, 188 )
				}
			]
		},

		/*
		| Widget has focus and hover.
		*/
		hofoc :
		{
			fill : euclid_color.rgba( 255, 188, 88, 0.7 ),

			edge :
			[
				{
					border : 1,
					width  : 1.5,
					color : euclid_color.rgb( 255, 99, 188 )
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
					color : euclid_color.rgba( 100, 100, 0, 0.1 )
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
					color : euclid_color.rgba( 255, 183, 15, 0.5 )
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
			fill : euclid_color.white,

			edge :
			[
				{
					border : 1,
					width : 1.5,
					color : euclid_color.rgb( 255, 188, 87 )
				},
				{
					border : 0,
					width : 1,
					color : euclid_color.black
				}
			]
		},

		hover :
		{
			fill : euclid_color.white,

			edge :
			[
				{
					border : 1,
					width : 2,
					color : euclid_color.rgb( 255, 188, 87 )
				},
				{
					border : 0,
					width : 1,
					color : euclid_color.rgb( 128, 128, 0 )
				}
			]
		},

		focus :
		{
			fill : euclid_color.white,

			edge :
			[
				{
					border : 1,
					width : 2,
					color : euclid_color.rgb( 255, 99, 188 )
				},
				{
					border : 0,
					width : 1,
					color : euclid_color.black
				}
			]
		},

		hofoc :
		{
			fill : euclid_color.white,

			edge :
			[
				{
					border : 0,
					width : 1,
					color : euclid_color.black
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
			fill : euclid_color.black,

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
			fill : euclid_color.white,

			edge :
			[
				{
					border : 1,
					width : 1.5,
					color : euclid_color.rgb( 255, 188, 87 )
				},
				{
					border : 0,
					width : 1,
					color : euclid_color.black
				}
			]
		},

		/*
		| Default input focused field style.
		*/
		focus :
		{
			fill : euclid_color.white,

			edge :
			[
				{
					border : 1,
					width : 2,
					color : euclid_color.rgb( 255, 99, 188 )
				},
				{
					border : 0,
					width : 1,
					color : euclid_color.black
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
		throw new Error( );
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
