/*
| Default design for the maindisc.
*/


var
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	disc_mainDisc,
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_facet,
	gleam_facetRay,
	gleam_gradient_colorStop,
	gleam_gradient_radial,
	euclid_point,
	gruga_iconMoveTo,
	gruga_iconNormal,
	gruga_iconRemove,
	gruga_iconSelect,
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
	dw,
	buttonFacets,
	buttonModel,
	buttonSize,
	createButtonPnw,
	loginButtonPnw,
	movetoButtonPnw,
	normalButtonPnw,
	removeButtonPnw,
	selectButtonPnw,
	signupButtonPnw,
	spaceButtonPnw,
	spaceButtonSize,
	userButtonPnw,
	userButtonSize;

dw = euclid_anchor_point.w;


buttonFacets =
	gleam_facetRay.create(
		'ray:init',
		[
			// default state.
			gleam_facet.create(
				'group:init', { },
				'fill', gleam_color.rgba( 255, 255, 240, 0.7 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill',
					gleam_color.rgba( 255, 235, 210, 0.7 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// down
			gleam_facet.create(
				'group:init', { 'down' : true },
				'fill', gleam_color.rgb( 255, 188, 88 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// down and hover
			gleam_facet.create(
				'group:init', { 'down' : true, 'hover' : true },
				'fill', gleam_color.rgb( 255, 188, 88 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgba( 196, 94, 44, 0.4 )
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

loginButtonPnw = dw.create( 'x', 30, 'y', 155 );

movetoButtonPnw = dw.create( 'x', 46, 'y', -74 );

normalButtonPnw = dw.create( 'x', 5, 'y', -324 );

selectButtonPnw = dw.create( 'x', 19, 'y', -270 );

createButtonPnw = dw.create( 'x', 31, 'y', -216 );

removeButtonPnw = dw.create( 'x', 40, 'y', -162 );

signupButtonPnw = dw.create( 'x', 17, 'y', 210 );

spaceButtonPnw = dw.create( 'x', 0, 'y', -230 );

spaceButtonSize = euclid_point.create( 'x', 28, 'y', 290 );

userButtonPnw = dw.create( 'x', 0, 'y', 40 );

userButtonSize = euclid_point.create( 'x', 24, 'y', 180 );


gruga_mainDisc =
	disc_mainDisc.abstract(
		'border',
			gleam_borderRay.create(
				'ray:append',
				gleam_border.create(
					'distance', 1,
					'color', gleam_color.rgb( 255, 94, 44 )
				),
				'ray:append',
				gleam_border.create(
					'color', gleam_color.rgb( 94, 94, 0 )
				)
			),
		'designArea',
			euclid_anchor_rect.create(
				'pnw',
					euclid_anchor_point.w.create( 'x', 0, 'y', -500 ),
				'pse',
					euclid_anchor_point.w.create( 'x', 100, 'y', 500 )
			),
		'shape',
			euclid_anchor_ellipse.create(
				'pnw',
					euclid_anchor_point.e.create(
						'x', -2201,
						'y', -1100
					),
				'pse',
					euclid_anchor_point.e.create(
						'x', -1,
						'y', 1100
					),
				'gradientPC',
					euclid_anchor_point.w.create(
						'x', -600,
						'y', 0
					),
				'gradientR1', 650
			),
		'fill',
			gleam_gradient_radial.create(
				'ray:append',
				gleam_gradient_colorStop.create(
					'offset', 0,
					'color', gleam_color.rgba( 255, 255,  20, 0.955 )
				),
				'ray:append',
				gleam_gradient_colorStop.create(
					'offset', 1,
					'color', gleam_color.rgba( 255, 255, 180, 0.955 )
				)
			),
		'twig:add', 'normal',
			buttonModel.create(
				'iconAnchorShape', gruga_iconNormal.shape,
				'iconFacet', gruga_iconNormal.facet,
				'designArea',
					euclid_anchor_rect.create(
						'pnw', normalButtonPnw,
						'pse', normalButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'select',
			buttonModel.create(
				'iconAnchorShape', gruga_iconSelect.shape,
				'iconFacet', gruga_iconSelect.facet,
				'visible', false,
				'designArea',
					euclid_anchor_rect.create(
						'pnw', selectButtonPnw,
						'pse', selectButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'create',
			buttonModel.create(
				'visible', false,
				'text', 'new',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'designArea',
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
				'designArea',
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
				'designArea',
					euclid_anchor_rect.create(
						'pnw', movetoButtonPnw,
						'pse', movetoButtonPnw.add( buttonSize )
					)
			),
		'twig:add', 'space',
			buttonModel.create(
				'designArea',
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
				'designArea',
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
				'designArea',
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
				'designArea',
					euclid_anchor_rect.create(
						'pnw', signupButtonPnw,
						'pse', signupButtonPnw.add( buttonSize )
					)
			)
	);

} )( );
