/*
| Default design for the maindisc.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	design_facet,
	design_facetRay,
	disc_mainDisc,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_point,
	gradient_colorStop,
	gradient_radial,
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

dnw = design_anchorPoint.nw;


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
			// focus
			design_facet.create(
				'group:init',
					{ 'focus' : true },
				'fill',
					euclid_color.rgb( 255, 188, 88 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// focus and hover
			design_facet.create(
				'group:init',
					{ 'focus' : true, 'hover' : true },
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
		'shape', design_anchorEllipse.fullSkewNW
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
	disc_mainDisc.create(
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
		'fill',
			gradient_radial.create(
				'ray:append',
				gradient_colorStop.create(
					'offset', 0,
					'color', euclid_color.rgba( 255, 255,  20, 0.955 )
				),
				'ray:append',
				gradient_colorStop.create(
					'offset', 1,
					'color', euclid_color.rgba( 255, 255, 180, 0.955 )
				)
			),
		'twig:add', 'normal',
			buttonModel.create(
				'icon', iconNormal,
				'designFrame',
					design_anchorRect.create(
						'pnw', normalButtonPnw,
						'pse', normalButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'create',
			buttonModel.create(
				'visible', false,
				'text', 'new',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'designFrame',
					design_anchorRect.create(
						'pnw', createButtonPnw,
						'pse', createButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'remove',
			buttonModel.create(
				'icon', iconRemove,
				'visible', false,
				'designFrame',
					design_anchorRect.create(
						'pnw', removeButtonPnw,
						'pse', removeButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'moveTo',
			buttonModel.create(
				'icon', iconMoveTo,
				'visible', false,
				'designFrame',
					design_anchorRect.create(
						'pnw', movetoButtonPnw,
						'pse', movetoButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'space',
			buttonModel.create(
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
			buttonModel.create(
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
			buttonModel.create(
				'visible', false,
				'text', 'log\nin',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'designFrame',
					design_anchorRect.create(
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
				'textDesignPos', design_anchorPoint.c,
				'designFrame',
					design_anchorRect.create(
						'pnw', signupButtonPnw,
						'pse', signupButtonPnw.add( buttonSize )
					)
			)
	);

} )( );
