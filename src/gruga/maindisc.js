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
	createButtonPnw,
	genericButtonModel,
	genericButtonSize,
	loginButtonPnw,
	movetoButtonPnw,
	normalButtonPnw,
	removeButtonPnw,
	signupButtonPnw,
	spaceButtonPnw,
	spaceButtonSize,
	userButtonPnw,
	userButtonSize;

dnw = design_anchorPoint.nw;

genericButtonModel =
	widget_button.abstract(
		'style', 'mainButton',
		'shape', design_anchorEllipse.fullSkewNW
	);

genericButtonSize = euclid_point.create( 'x', 44, 'y', 44 );

createButtonPnw = dnw.create( 'x', 20, 'y', 169 );

loginButtonPnw = dnw.create( 'x', 30, 'y', 535 );

movetoButtonPnw = dnw.create( 'x', 47, 'y', 326 );

normalButtonPnw = dnw.create( 'x', 4, 'y', 120 );

removeButtonPnw = dnw.create( 'x', 32, 'y', 218 );

signupButtonPnw = dnw.create( 'x', 19, 'y', 585 );

spaceButtonPnw = dnw.create( 'x', 0, 'y', 170 );

spaceButtonSize = euclid_point.create( 'x', 28, 'y', 290 );

userButtonPnw = dnw.create( 'x', 0, 'y', 440 );

userButtonSize = euclid_point.create( 'x', 24, 'y', 180 );


gruga_mainDisc =
	disc_mainDisc.create(
		'twig:add', 'normal',
			genericButtonModel.create(
				'icon', 'normal',
				'iconStyle', 'iconNormal',
				'designFrame',
					design_anchorRect.create(
						'pnw', normalButtonPnw,
						'pse', normalButtonPnw.add( genericButtonSize )
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
						'pnw', createButtonPnw,
						'pse', createButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add', 'remove',
			genericButtonModel.create(
				'icon', 'remove',
				'iconStyle', 'iconRemove',
				'visible', false,
				'designFrame',
					design_anchorRect.create(
						'pnw', removeButtonPnw,
						'pse', removeButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add', 'moveTo',
			genericButtonModel.create(
				'icon', 'moveto',
				'iconStyle', 'iconNormal',
				'visible', false,
				'designFrame',
					design_anchorRect.create(
						'pnw', movetoButtonPnw,
						'pse', movetoButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add', 'space',
			genericButtonModel.create(
				'designFrame',
					design_anchorRect.create(
						'pnw', spaceButtonPnw,
						'pse', spaceButtonPnw.add( spaceButtonSize )
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'shape',
					design_anchorEllipse.create(
						'pnw', design_anchorPoint.nw.create( 'x', -60, 'y', 0 ),
						'pse', design_anchorPoint.seMin1
					),
				'textRotation', - Math.PI / 2
			),
		'twig:add', 'user',
			genericButtonModel.create(
				'designFrame',
					design_anchorRect.create(
						'pnw', userButtonPnw,
						'pse', userButtonPnw.add( userButtonSize )
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'shape',
					design_anchorEllipse.create(
						'pnw', design_anchorPoint.nw.create( 'x', -70, 'y', 0 ),
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
						'pnw', loginButtonPnw,
						'pse', loginButtonPnw.add( genericButtonSize )
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
						'pnw', signupButtonPnw,
						'pse', signupButtonPnw.add( genericButtonSize )
					)
			)
	);

} )( );
