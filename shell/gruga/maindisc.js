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
	Design,
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
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.normal.x,
							'y',
								design.normal.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.normal.x +
								design.generic.width,
							'y',
								design.normal.y +
								design.generic.height
						)
				),

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
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
					Design.AnchorPoint.PC
			},

			frame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.create.x,
							'y',
								design.create.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.create.x +
								design.generic.width,
							'y',
								design.create.y +
								design.generic.height
						)
				),

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
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
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.remove.x,
							'y',
								design.remove.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.remove.x +
								design.generic.width,
							'y',
								design.remove.y +
								design.generic.height
						)
				),

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
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
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.moveto.x,
							'y',
								design.moveto.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.moveto.x +
								design.generic.width,
							'y',
								design.moveto.y +
								design.generic.height
						)
				),

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
			}
		},


		'Space' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			frame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.space.x,
							'y',
								design.space.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.space.x +
								design.space.width,
							'y',
								design.space.y +
								design.space.height
						)
				),

			caption :
			{
				type :
					'LabelWidget',

				text :
					'',

				font :
					fontPool.get( 12, 'cm' ),

				pos :
					Design.AnchorPoint.PC,

				rotate :
					- Math.PI / 2
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.create(
						'anchor',
							'nw',
						'x',
							-60,
						'y',
							0
					),

				pse :
					Design.AnchorPoint.create(
						'anchor',
							'se',

						'x',
							-1,
						'y',
							-1
					)
			}
		},

		'User' :
		{
			type :
				'ButtonWidget',

			style :
				'mainButton',

			frame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.user.x,
							'y',
								design.user.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.user.x +
								design.user.width,
							'y',
								design.user.y +
								design.user.height
						)
				),

			caption :
			{
				type :
					'LabelWidget',

				text :
					'',

				font :
					fontPool.get( 12, 'cm' ),

				pos :
					Design.AnchorPoint.PC,

				rotate :
					- Math.PI / 2
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.create(
						'anchor',
							'nw',
						'x',
							-70,
						'y',
							0
					),

				pse :
					Design.AnchorPoint.create(
						'anchor',
							'se',
						'x',
							-1,
						'y',
							-1
					)
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
					Design.AnchorPoint.PC
			},

			frame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.login.x,
							'y',
								design.login.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.login.x +
								design.generic.width,
							'y',
								design.login.y +
								design.generic.height
						)
				),

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
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
					Design.AnchorPoint.PC
			},

			frame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.signup.x,
							'y',
								design.signup.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.signup.x +
								design.generic.width,
							'y',
								design.signup.y +
								design.generic.height
						)
				),

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
			}
		}
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
	]
};


} )( );
