/*
| Default design for the maindisc.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Gruga;


Gruga =
	Gruga || { };


/*
| Imports
*/
var
	fontPool;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| All important design variables for convenience
*/
var design =
{
	generic :
	{
		width :
			44,

		height :
			44,

		font :
			fontPool.get( 14, 'cm' )
	},

	normal :
	{
		x :
			4,

		y :
			120
	},

	create :
	{
		x :
			20,

		y :
			169
	},

	remove :
	{
		x :
			32,

		y :
			218
	},

	moveto :
	{
		x :
			47,

		y :
			326
	},

	space :
	{
		width :
			28,

		height :
			290,

		x :
			0,

		y :
			170
	},

	user :
	{
		width :
			24,

		height :
			180,

		x :
			0,
		y :
			440
	},

	login :
	{
		x :
			30,

		y :
			535
	},

	signup :
	{
		x :
			19,

		y :
			585
	}

	/*
	help :
	{
		x :
			4,

		y :
			635
	}
	*/
};


Gruga.MainDisc =
{
	type :
		'Layout',

	twig :
	{
		'Normal' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			icon :
				'normal',

			iconStyle :
				'iconNormal',

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.normal.x,

					y :
						design.normal.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.normal.x +
							design.generic.width,

					y :
						design.normal.y +
							design.generic.height
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'Create' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			visible :
				false,

			caption :
			{
				type :
					'LabelWidget',

				text :
					'new',

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.create.x,

					y :
						design.create.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.create.x +
							design.generic.width,

					y :
						design.create.y +
							design.generic.height
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'Remove' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			icon :
				'remove',

			iconStyle :
				'iconRemove',

			visible :
				false,

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.remove.x,

					y :
						design.remove.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.remove.x +
							design.generic.width,

					y :
						design.remove.y +
							design.generic.height
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'MoveTo' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			icon :
				'moveto',

			iconStyle :
				'iconNormal',

			visible :
				false,

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.moveto.x,

					y :
						design.moveto.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.moveto.x +
							design.generic.width,

					y :
						design.moveto.y +
							design.generic.height
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},


		'Space' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.space.x,

					y :
						design.space.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.space.x +
							design.space.width,

					y :
						design.space.y +
							design.space.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'',

				font :
					fontPool.get( 12, 'cm' ),

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				},

				rotate :
					- Math.PI / 2
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						-60,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'User' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.user.x,

					y :
						design.user.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.user.x +
							design.user.width,

					y :
						design.user.y +
							design.user.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'',

				font :
					fontPool.get( 12, 'cm' ),

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				},

				rotate :
					- Math.PI / 2
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						-70,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'Login' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			visible :
				false,

			caption :
			{
				type :
					'LabelWidget',

				text :
					'log\nin',

				newline :
					14,

				font :
					fontPool.get( 13, 'cm' ),

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.login.x,

					y :
						design.login.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.login.x +
							design.generic.width,

					y :
						design.login.y +
							design.generic.height
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'SignUp' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			visible :
				false,

			caption :
			{
				type :
					'LabelWidget',

				text :
					'sign\nup',

				newline :
					14,

				font :
					fontPool.get( 13, 'cm' ),

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.signup.x,

					y :
						design.signup.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.signup.x +
							design.generic.width,

					y :
						design.signup.y +
							design.generic.height
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		}

		/*
		'Help' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'help',

				font :
					fontPool.get( 13, 'cm' ),

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},

			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.help.x,

					y :
						design.help.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.help.x +
							design.generic.width,

					y :
						design.help.y +
							design.generic.height
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		}
		*/
	},

	ranks :
	[
		'Normal',
		'Create',
		'Remove',
		'MoveTo',
		'Space',
		'User',
		'Login',
		'SignUp'
		// 'help'
	]
};


} )( );
