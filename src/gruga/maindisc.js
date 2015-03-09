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
	dnw,
	dv,
	genericButtonModel,
	spaceSize,
	userSize;

dnw = design_anchorPoint.nw;

genericButtonModel =
	widget_button.abstract(
		'style', 'mainButton',
		'shape', design_anchorEllipse.fullSkewNW
	);

spaceSize =
	{
		width : 28,
		height : 290
	};

userSize =
	{
		width : 24,
		height : 180
	};

dv =
	{
		generic :
		{
			width : 44,
			height : 44,
			font : shell_fontPool.get( 14, 'cm' )
		},

		normal : dnw.create( 'x', 4, 'y', 120 ),

		create : dnw.create( 'x', 20, 'y', 169 ),

		remove : dnw.create( 'x', 32, 'y', 218 ),

		moveto : dnw.create( 'x', 47, 'y', 326 ),

		space : dnw.create( 'x', 0, 'y', 170 ),

		user : dnw.create( 'x', 0, 'y', 440 ),

		login : dnw.create( 'x', 30, 'y', 535 ),

		signup : dnw.create( 'x', 19, 'y', 585 )
	};




gruga_mainDisc =
	disc_mainDisc.create(
		'twig:add', 'normal',
			genericButtonModel.create(
				'icon', 'normal',
				'iconStyle', 'iconNormal',
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.normal,
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.normal.x + dv.generic.width,
								'y', dv.normal.y + dv.generic.height
							)
					)
			),
		'twig:add', 'create',
			genericButtonModel.create(
				'visible', false,
				'text', 'new',
				'font', dv.generic.font,
				'textDesignPos', design_anchorPoint.c,
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.create,
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.create.x + dv.generic.width,
								'y', dv.create.y + dv.generic.height
							)
					)
			),
		'twig:add', 'remove',
			genericButtonModel.create(
				'icon', 'remove',
				'iconStyle', 'iconRemove',
				'visible', false,
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.remove,
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.remove.x + dv.generic.width,
								'y', dv.remove.y + dv.generic.height
							)
					)
			),
		'twig:add', 'moveTo',
			genericButtonModel.create(
				'icon', 'moveto',
				'iconStyle', 'iconNormal',
				'visible', false,
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.moveto,
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.moveto.x + dv.generic.width,
								'y', dv.moveto.y + dv.generic.height
							)
					)
			),
		'twig:add', 'space',
			genericButtonModel.create(
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.space,
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.space.x + spaceSize.width,
								'y', dv.space.y + spaceSize.height
							)
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'shape',
					design_anchorEllipse.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', -60,
								'y', 0
							),
						'pse', design_anchorPoint.seMin1
					),
				'textRotation', - Math.PI / 2
			),
		'twig:add', 'user',
			genericButtonModel.create(
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.user,
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.user.x + userSize.width,
								'y', dv.user.y + userSize.height
							)
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'shape',
					design_anchorEllipse.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', -70,
								'y', 0
							),
						'pse', design_anchorPoint.seMin1
					),
				'textRotation', ( -Math.PI / 2 )
			),
		'twig:add', 'login',
			genericButtonModel.create(
				'visible', false,
				'text', 'log\nin',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
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
					)
			),
		'twig:add', 'signUp',
			genericButtonModel.create(
				'visible', false,
				'text', 'sign\nup',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.signup,
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.signup.x + dv.generic.width,
								'y', dv.signup.y + dv.generic.height
							)
					)
			)
	);

} )( );
