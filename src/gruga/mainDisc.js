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
	createButtonPos,
	loginButtonPos,
	movetoButtonPos,
	normalButtonPos,
	removeButtonPos,
	selectButtonPos,
	signupButtonPos,
	spaceButtonPos,
	spaceButtonSize,
	userButtonPos,
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

buttonSize = gleam_size.create( 'width', 44, 'height', 44 );

loginButtonPos = pw.add( 30, 155 );

movetoButtonPos = pw.add( 46, -74 );

normalButtonPos = pw.add( 5, -324 );

selectButtonPos = pw.add( 19, -270 );

createButtonPos = pw.add( 31, -216 );

removeButtonPos = pw.add( 40, -162 );

signupButtonPos = pw.add( 17, 210 );

spaceButtonPos = pw.add( 0, -230 );

spaceButtonSize = gleam_size.wh( 28, 290 );

userButtonPos = pw.add( 0, 40 );

userButtonSize = gleam_size.wh( 24, 180 );


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
				'pos', gleam_point.xy( -2101, -1100 ),
				'width', 2200,
				'height', 2200,
				'gradientPC', gleam_point.xy( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add', 'normal',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( normalButtonPos, buttonSize ),
				'iconShape', gruga_iconNormal.shape,
				'iconFacet', gruga_iconNormal.facet
			),
		'twig:add', 'select',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( selectButtonPos, buttonSize ),
				'iconShape', gruga_iconSelect.shape,
				'iconFacet', gruga_iconSelect.facet,
				'visible', false
			),
		'twig:add', 'create',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( createButtonPos, buttonSize ),
				'font', shell_fontPool.get( 14, 'cm' ),
				'text', 'new',
				'visible', false
			),
		'twig:add', 'remove',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( removeButtonPos, buttonSize ),
				'iconShape', gruga_iconRemove.shape,
				'iconFacet', gruga_iconRemove.facet,
				'visible', false
			),
		'twig:add', 'moveTo',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( movetoButtonPos, buttonSize ),
				'text', 'go',
				'font', shell_fontPool.get( 14, 'cm' ),
				'visible', false
			),
		'twig:add', 'space',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( spaceButtonPos, spaceButtonSize ),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'shape',
					gleam_ellipse.posSize(
						gleam_point.xy( -60, 0 ),
						spaceButtonSize.add( 60 - 1, -1 )
					),
				'textRotation', - Math.PI / 2
			),
		'twig:add', 'user',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( userButtonPos, userButtonSize ),
				'text', '',
				'font', shell_fontPool.get( 12, 'cm' ),
				'shape',
					gleam_ellipse.posSize(
						gleam_point.xy( -70, 0 ),
						userButtonSize.add( 70 - 1, -1 )
					),
				'textRotation', ( -Math.PI / 2 )
			),
		'twig:add', 'login',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( loginButtonPos, buttonSize ),
				'text', 'log\nin',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'visible', false
			),
		'twig:add', 'signUp',
			buttonModel.abstract(
				'zone', gleam_rect.posSize( signupButtonPos, buttonSize ),
				'text', 'sign\nup',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'cm' ),
				'visible', false
			)
	);


if( FREEZE ) Object.freeze( gruga_mainDisc );


} )( );
