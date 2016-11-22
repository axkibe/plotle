/*
| Default design for the maindisc.
*/


var
	disc_mainDisc,
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	euclid_point,
	euclid_rect,
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_facet,
	gleam_facetRay,
	gleam_gradient_colorStop,
	gleam_gradient_radial,
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
	pw,
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

pw =
	euclid_point.create(
		'x', 0,
		'y', 500
	);


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
		'shape', 'ellipse'
	);

buttonSize = euclid_point.create( 'x', 44, 'y', 44 );

loginButtonPnw = pw.add( 30, 155 );

movetoButtonPnw = pw.add( 46, -74 );

normalButtonPnw = pw.add( 5, -324 );

selectButtonPnw = pw.add( 19, -270 );

createButtonPnw = pw.add( 31, -216 );

removeButtonPnw = pw.add( 40, -162 );

signupButtonPnw = pw.add( 17, 210 );

spaceButtonPnw = pw.add( 0, -230 );

spaceButtonSize = euclid_point.create( 'x', 28, 'y', 290 );

userButtonPnw = pw.add( 0, 40 );

userButtonSize = euclid_point.create( 'x', 24, 'y', 180 );


gruga_mainDisc =
	disc_mainDisc.abstract(
		'designArea',
			euclid_anchor_rect.create(
				'pnw',
					euclid_anchor_point.w.create( 'x', 0, 'y', -500 ),
				'pse',
					euclid_anchor_point.w.create( 'x', 100, 'y', 500 )
			),
		'facet',
			gleam_facet.create(
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
					)
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
		'twig:add', 'normal',
			buttonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', normalButtonPnw,
						'pse', normalButtonPnw.add( buttonSize )
					),
				'iconShape', gruga_iconNormal.shape,
				'iconFacet', gruga_iconNormal.facet
			),
		'twig:add', 'select',
			buttonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', selectButtonPnw,
						'pse', selectButtonPnw.add( buttonSize )
					),
				'iconShape', gruga_iconSelect.shape,
				'iconFacet', gruga_iconSelect.facet,
				'visible', false
			),
		'twig:add', 'create',
			buttonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', createButtonPnw,
						'pse', createButtonPnw.add( buttonSize )
					),
				'font', shell_fontPool.get( 14, 'cm' ),
				'text', 'new',
				'textDesignPos', euclid_anchor_point.c,
				'visible', false
			),
		'twig:add', 'remove',
			buttonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', removeButtonPnw,
						'pse', removeButtonPnw.add( buttonSize )
					),
				'iconShape', gruga_iconRemove.shape,
				'iconFacet', gruga_iconRemove.facet,
				'visible', false
			),
		'twig:add', 'moveTo',
			buttonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', movetoButtonPnw,
						'pse', movetoButtonPnw.add( buttonSize )
					),
				'text', 'go',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'visible', false
			),
		'twig:add', 'space',
			buttonModel.abstract(
				'area',
					euclid_rect.create(
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
			buttonModel.abstract(
				'area',
					euclid_rect.create(
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
			buttonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', loginButtonPnw,
						'pse', loginButtonPnw.add( buttonSize )
					),
				'text', 'log\nin',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'visible', false
			),
		'twig:add', 'signUp',
			buttonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', signupButtonPnw,
						'pse', signupButtonPnw.add( buttonSize )
					),
				'text', 'sign\nup',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'visible', false
			)
	);

} )( );
