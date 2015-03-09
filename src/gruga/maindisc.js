/*
| Default design for the maindisc.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	disc_mainDisc,
	euclid_point,
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
	genericButtonSize,
	spaceButtonSize,
	userButtonSize;

dnw = design_anchorPoint.nw;

genericButtonModel =
	widget_button.abstract(
		'style', 'mainButton',
		'shape', design_anchorEllipse.fullSkewNW
	);

genericButtonSize = euclid_point.create( 'x', 44, 'y', 44 );

spaceButtonSize = euclid_point.create( 'x', 28, 'y', 290 );

userButtonSize = euclid_point.create( 'x', 24, 'y', 180 );

dv =
	{
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
						'pse', dv.normal.add( genericButtonSize )
					)
			),
		'twig:add', 'create',
			genericButtonModel.create(
				'visible', false,
				'text', 'new',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.create,
						'pse', dv.create.add( genericButtonSize )
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
						'pse', dv.remove.add( genericButtonSize )
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
						'pse', dv.moveto.add( genericButtonSize )
					)
			),
		'twig:add', 'space',
			genericButtonModel.create(
				'designFrame',
					design_anchorRect.create(
						'pnw', dv.space,
						'pse', dv.space.add( spaceButtonSize )
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
						'pse', dv.user.add( userButtonSize )
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
						'pnw', dv.login,
						'pse', dv.login.add( genericButtonSize )
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
						'pse', dv.signup.add( genericButtonSize )
					)
			)
	);

} )( );
