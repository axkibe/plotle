/*
| Default design for the maindisc.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	disc_mainDisc,
	gruga_mainDisc,
	shell_fontPool,
	widget_button;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| All important design variables for convenience.
*/
var
	dv;

dv =
	{
		generic :
		{
			width :
				44,
			height :
				44,
			font :
				shell_fontPool.get( 14, 'cm' )
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
	};

gruga_mainDisc =
	disc_mainDisc.create(
		'twig:add', 'Normal',
			widget_button.create(
				'style', 'mainButton',
				'icon', 'normal',
				'iconStyle', 'iconNormal',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.normal.x,
								'y', dv.normal.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.normal.x + dv.generic.width,
								'y', dv.normal.y + dv.generic.height
							)
					),
				'shape',
					design_anchorEllipse.fullSkewNW
			),
		'twig:add', 'create',
			widget_button.create(
				'style', 'mainButton',
				'visible', false,
				'text', 'new',
				'font', dv.generic.font,
				'textDesignPos', design_anchorPoint.PC,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.create.x,
								'y', dv.create.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.create.x + dv.generic.width,
								'y', dv.create.y + dv.generic.height
							)
					),
				'shape',
					design_anchorEllipse.fullSkewNW
			),
		'twig:add', 'Remove',
			widget_button.create(
				'style', 'mainButton',
				'icon', 'remove',
				'iconStyle', 'iconRemove',
				'visible', false,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.remove.x,
								'y', dv.remove.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.remove.x + dv.generic.width,
								'y', dv.remove.y + dv.generic.height
							)
					),
				'shape',
					design_anchorEllipse.fullSkewNW
			),
		'twig:add', 'moveTo',
			widget_button.create(
				'style', 'mainButton',
				'icon', 'moveto',
				'iconStyle', 'iconNormal',
				'visible', false,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.moveto.x,
								'y', dv.moveto.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.moveto.x + dv.generic.width,
								'y', dv.moveto.y + dv.generic.height
							)
					),
				'shape', design_anchorEllipse.fullSkewNW
			),
		'twig:add', 'space',
			widget_button.create(
				'style', 'mainButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.space.x,
								'y', dv.space.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.space.x + dv.space.width,
								'y', dv.space.y + dv.space.height
							)
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', design_anchorPoint.PC,
				'shape',
					design_anchorEllipse.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', -60,
								'y', 0
							),
						'pse',
							design_anchorPoint.PSE_M1
					),
				'textRotation', - Math.PI / 2
			),
		'twig:add', 'user',
			widget_button.create(
				'style', 'mainButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.user.x,
								'y', dv.user.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.user.x + dv.user.width,
								'y', dv.user.y + dv.user.height
							)
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', design_anchorPoint.PC,
				'shape',
					design_anchorEllipse.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', -70,
								'y', 0
							),
						'pse',
							design_anchorPoint.PSE_M1
					),
				'textRotation', ( -Math.PI / 2 )
			),
		'twig:add', 'login',
			widget_button.create(
				'style', 'mainButton',
				'visible', false,
				'text', 'log\nin',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', design_anchorPoint.PC,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.login.x,
								'y', dv.login.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.login.x + dv.generic.width,
								'y', dv.login.y + dv.generic.height
							)
					),
				'shape', design_anchorEllipse.fullSkewNW
			),
		'twig:add', 'signUp',
			widget_button.create(
				'style', 'mainButton',
				'visible', false,
				'text', 'sign\nup',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', design_anchorPoint.PC,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.signup.x,
								'y', dv.signup.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.signup.x + dv.generic.width,
								'y', dv.signup.y + dv.generic.height
							)
					),
				'shape', design_anchorEllipse.fullSkewNW
			)
	);

} )( );
