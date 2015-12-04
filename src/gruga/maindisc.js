/*
| Default design for the maindisc.
*/


var
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	disc_mainDisc,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_facet,
	euclid_facetRay,
	euclid_gradient_colorStop,
	euclid_gradient_radial,
	euclid_point,
	gruga_iconMoveTo,
	gruga_iconNormal,
	gruga_iconRemove,
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
	buttonFacets,
	buttonModel,
	buttonSize,
	createButtonPnw,
	loginButtonPnw,
	movetoButtonPnw,
	normalButtonPnw,
	removeButtonPnw,
	signupButtonPnw,
	spaceButtonPnw,
	spaceButtonSize,
	userButtonPnw,
	userButtonSize;

dnw = euclid_anchor_point.nw;


buttonFacets =
	euclid_facetRay.create(
		'ray:init',
		[
			// default state.
			euclid_facet.create(
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
			euclid_facet.create(
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
			euclid_facet.create(
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
			euclid_facet.create(
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
		'shape', euclid_anchor_ellipse.fullSkewNW
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
			euclid_anchor_rect.create(
				'pnw',
					euclid_anchor_point.w.create( 'x', 0, 'y', -400 ),
				'pse',
					euclid_anchor_point.w.create( 'x', 120, 'y', 400 )
			),
		'shape',
			euclid_anchor_ellipse.create(
				'pnw',
					euclid_anchor_point.e.create(
						'x', -1601,
						'y', -800
					),
				'pse',
					euclid_anchor_point.e.create(
						'x', -1,
						'y', 800
					),
				'gradientPC',
					euclid_anchor_point.w.create(
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
				'iconAnchorShape', gruga_iconNormal.shape,
				'iconFacet', gruga_iconNormal.facet,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', normalButtonPnw,
						'pse', normalButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'create',
			buttonModel.create(
				'visible', false,
				'text', 'new',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', createButtonPnw,
						'pse', createButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'remove',
			buttonModel.create(
				'iconAnchorShape', gruga_iconRemove.shape,
				'iconFacet', gruga_iconRemove.facet,
				'visible', false,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', removeButtonPnw,
						'pse', removeButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'moveTo',
			buttonModel.create(
				'iconAnchorShape', gruga_iconMoveTo.shape,
				'iconFacet', gruga_iconMoveTo.facet,
				'visible', false,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', movetoButtonPnw,
						'pse', movetoButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'space',
			buttonModel.create(
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', spaceButtonPnw,
						'pse', spaceButtonPnw.add( spaceButtonSize )
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'shape',
					euclid_anchor_ellipse.create(
						'pnw', euclid_anchor_point.nw.create( 'x', -60, 'y', 0 ),
						'pse', euclid_anchor_point.seMin1
					),
				'textRotation', - Math.PI / 2
			),
		'twig:add', 'user',
			buttonModel.create(
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', userButtonPnw,
						'pse', userButtonPnw.add( userButtonSize )
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'shape',
					euclid_anchor_ellipse.create(
						'pnw', euclid_anchor_point.nw.create( 'x', -70, 'y', 0 ),
						'pse', euclid_anchor_point.seMin1
					),
				'textRotation', ( -Math.PI / 2 )
			),
		'twig:add', 'login',
			buttonModel.create(
				'visible', false,
				'text', 'log\nin',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'designFrame',
					euclid_anchor_rect.create(
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
				'textDesignPos', euclid_anchor_point.c,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', signupButtonPnw,
						'pse', signupButtonPnw.add( buttonSize )
					)
			)
	);

} )( );
