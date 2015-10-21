/*
| Default design for the maindisc.
*/


var
	design_ellipse,
	design_point,
	design_rect,
	design_facet,
	design_facetRay,
	disc_mainDisc,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_point,
	euclid_gradient_colorStop,
	euclid_gradient_radial,
	gruga_mainDisc,
	icon_moveto,
	icon_normal,
	icon_remove,
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
	buttonFacets,
	buttonModel,
	buttonSize,
	createButtonPnw,
	iconMoveTo,
	iconNormal,
	iconRemove,
	loginButtonPnw,
	movetoButtonPnw,
	normalButtonPnw,
	removeButtonPnw,
	signupButtonPnw,
	spaceButtonPnw,
	spaceButtonSize,
	userButtonPnw,
	userButtonSize;

dnw = design_point.nw;


iconMoveTo =
	icon_moveto.create(
		'fill', euclid_color.rgb( 107, 91, 73 ),
		'border',
			euclid_border.create(
				'color', euclid_color.rgb( 128, 0, 0 )
			)
	);

iconNormal =
	icon_normal.create(
		'fill', euclid_color.black,
		'border',
			euclid_border.create(
				'color', euclid_color.rgb( 128, 0, 0 )
			)
	);


// The red criss-cross for the remove button
iconRemove =
	icon_remove.create(
		'fill', euclid_color.rgb( 255, 0, 0 ),
		'border',
			euclid_border.create(
				'color', euclid_color.rgb( 128, 0, 0 )
			)
	);


buttonFacets =
	design_facetRay.create(
		'ray:init',
		[
			// default state.
			design_facet.create(
				'group:init',
					{ },
				'fill',
					euclid_color.rgba( 255, 255, 240, 0.7 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// hover
			design_facet.create(
				'group:init',
					{ 'hover' : true },
				'fill',
					euclid_color.rgba( 255, 235, 210, 0.7 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// down
			design_facet.create(
				'group:init',
					{ 'down' : true },
				'fill',
					euclid_color.rgb( 255, 188, 88 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// down and hover
			design_facet.create(
				'group:init',
					{ 'down' : true, 'hover' : true },
				'fill',
					euclid_color.rgb( 255, 188, 88 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgba( 196, 94, 44, 0.4 )
					)
			)
		]
	);

buttonModel =
	widget_button.abstract(
		'facets', buttonFacets,
		'shape', design_ellipse.fullSkewNW
	);

buttonSize = euclid_point.create( 'x', 44, 'y', 44 );

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
	disc_mainDisc.abstract(
		'border',
			euclid_borderRay.create(
				'ray:append',
				euclid_border.create(
					'distance', 1,
					'color', euclid_color.rgb( 255, 94, 44 )
				),
				'ray:append',
				euclid_border.create(
					'color', euclid_color.rgb( 94, 94, 0 )
				)
			),
		'designFrame',
			design_rect.create(
				'pnw',
					design_point.w.create( 'x', 0, 'y', -400 ),
				'pse',
					design_point.w.create( 'x', 100, 'y', 400 )
			),
		'shape',
			design_ellipse.create(
				'pnw',
					design_point.e.create(
						'x', -1601,
						'y', -800
					),
				'pse',
					design_point.e.create(
						'x', -1,
						'y', 800
					),
				'gradientPC',
					design_point.w.create(
						'x', -600,
						'y', 0
					),
				'gradientR1', 650
			),
		'fill',
			euclid_gradient_radial.create(
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 0,
					'color', euclid_color.rgba( 255, 255,  20, 0.955 )
				),
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 1,
					'color', euclid_color.rgba( 255, 255, 180, 0.955 )
				)
			),
		'twig:add', 'normal',
			buttonModel.create(
				'icon', iconNormal,
				'designFrame',
					design_rect.create(
						'pnw', normalButtonPnw,
						'pse', normalButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'create',
			buttonModel.create(
				'visible', false,
				'text', 'new',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_point.c,
				'designFrame',
					design_rect.create(
						'pnw', createButtonPnw,
						'pse', createButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'remove',
			buttonModel.create(
				'icon', iconRemove,
				'visible', false,
				'designFrame',
					design_rect.create(
						'pnw', removeButtonPnw,
						'pse', removeButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'moveTo',
			buttonModel.create(
				'icon', iconMoveTo,
				'visible', false,
				'designFrame',
					design_rect.create(
						'pnw', movetoButtonPnw,
						'pse', movetoButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'space',
			buttonModel.create(
				'designFrame',
					design_rect.create(
						'pnw', spaceButtonPnw,
						'pse', spaceButtonPnw.add( spaceButtonSize )
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', design_point.c,
				'shape',
					design_ellipse.create(
						'pnw', design_point.nw.create( 'x', -60, 'y', 0 ),
						'pse', design_point.seMin1
					),
				'textRotation', - Math.PI / 2
			),
		'twig:add', 'user',
			buttonModel.create(
				'designFrame',
					design_rect.create(
						'pnw', userButtonPnw,
						'pse', userButtonPnw.add( userButtonSize )
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', design_point.c,
				'shape',
					design_ellipse.create(
						'pnw', design_point.nw.create( 'x', -70, 'y', 0 ),
						'pse', design_point.seMin1
					),
				'textRotation', ( -Math.PI / 2 )
			),
		'twig:add', 'login',
			buttonModel.create(
				'visible', false,
				'text', 'log\nin',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', design_point.c,
				'designFrame',
					design_rect.create(
						'pnw', loginButtonPnw,
						'pse', loginButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'signUp',
			buttonModel.create(
				'visible', false,
				'text', 'sign\nup',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', design_point.c,
				'designFrame',
					design_rect.create(
						'pnw', signupButtonPnw,
						'pse', signupButtonPnw.add( buttonSize )
					)
			)
	);

} )( );
