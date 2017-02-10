/*
| Default design for the maindisc.
*/


var
	disc_mainDisc,
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_ellipse,
	gleam_facet,
	gleam_facetRay,
	gleam_gradient_colorStop,
	gleam_gradient_radial,
	gleam_point,
	gleam_rect,
	gleam_size,
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

pw = gleam_point.xy( 0, 500 );


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

buttonSize = gleam_point.create( 'x', 44, 'y', 44 );

loginButtonPnw = pw.add( 30, 155 );

movetoButtonPnw = pw.add( 46, -74 );

normalButtonPnw = pw.add( 5, -324 );

selectButtonPnw = pw.add( 19, -270 );

createButtonPnw = pw.add( 31, -216 );

removeButtonPnw = pw.add( 40, -162 );

signupButtonPnw = pw.add( 17, 210 );

spaceButtonPnw = pw.add( 0, -230 );

spaceButtonSize = gleam_point.xy( 28, 290 );

userButtonPnw = pw.add( 0, 40 );

userButtonSize = gleam_point.xy( 24, 180 );


gruga_mainDisc =
	disc_mainDisc.abstract(
		'size',
			gleam_size.create(
				'width', 100,
				'height', 1000
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
			gleam_ellipse.create(
				'pnw', gleam_point.xy( -2101, -1100 ),
				'pse', gleam_point.xy( 99, 1100 ),
				'gradientPC', gleam_point.xy( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add', 'normal',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', normalButtonPnw,
						'pse', normalButtonPnw.add( buttonSize )
					),
				'iconShape', gruga_iconNormal.shape,
				'iconFacet', gruga_iconNormal.facet
			),
		'twig:add', 'select',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', selectButtonPnw,
						'pse', selectButtonPnw.add( buttonSize )
					),
				'iconShape', gruga_iconSelect.shape,
				'iconFacet', gruga_iconSelect.facet,
				'visible', false
			),
		'twig:add', 'create',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', createButtonPnw,
						'pse', createButtonPnw.add( buttonSize )
					),
				'font', shell_fontPool.get( 14, 'cm' ),
				'text', 'new',
				'visible', false
			),
		'twig:add', 'remove',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', removeButtonPnw,
						'pse', removeButtonPnw.add( buttonSize )
					),
				'iconShape', gruga_iconRemove.shape,
				'iconFacet', gruga_iconRemove.facet,
				'visible', false
			),
		'twig:add', 'moveTo',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', movetoButtonPnw,
						'pse', movetoButtonPnw.add( buttonSize )
					),
				'text', 'go',
				'font', shell_fontPool.get( 14, 'cm' ),
				'visible', false
			),
		'twig:add', 'space',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', spaceButtonPnw,
						'pse', spaceButtonPnw.add( spaceButtonSize )
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'shape',
					gleam_ellipse.create(
						'pnw', gleam_point.xy( -60, 0 ),
						'pse', spaceButtonSize.sub( 1, 1 )
					),
				'textRotation', - Math.PI / 2
			),
		'twig:add', 'user',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', userButtonPnw,
						'pse', userButtonPnw.add( userButtonSize )
					),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'shape',
					gleam_ellipse.create(
						'pnw', gleam_point.xy( -70, 0 ),
						'pse', userButtonSize.sub( 1, 1 )
					),
				'textRotation', ( -Math.PI / 2 )
			),
		'twig:add', 'login',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', loginButtonPnw,
						'pse', loginButtonPnw.add( buttonSize )
					),
				'text', 'log\nin',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'visible', false
			),
		'twig:add', 'signUp',
			buttonModel.abstract(
				'zone',
					gleam_rect.create(
						'pnw', signupButtonPnw,
						'pse', signupButtonPnw.add( buttonSize )
					),
				'text', 'sign\nup',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'visible', false
			)
	);


if( FREEZE ) Object.freeze( gruga_mainDisc );


} )( );
