/*
| Default design of the creation disc.
*/


var
	disc_createDisc,
	euclid_ellipse,
	euclid_point,
	euclid_rect,
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_facet,
	gleam_facetRay,
	gleam_gradient_colorStop,
	gleam_gradient_radial,
	gleam_size,
	euclid_point,
	gruga_createDisc,
	shell_fontPool,
	widget_button;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	genericButtonFacets,
	genericButtonModel,
	genericButtonSize,
	labelButtonPnw,
	noteButtonPnw,
	portalButtonPnw,
	pw,
	relationButtonPnw;


pw = euclid_point.create( 'x', 0, 'y', 505 );

noteButtonPnw = pw.add( 65, -325 );

labelButtonPnw = pw.add( 81, -254 );

relationButtonPnw = pw.add( 92, -183 );

portalButtonPnw = pw.add( 99, -112 );

genericButtonSize = euclid_point.create( 'x', 70, 'y', 70 );

genericButtonFacets =
	gleam_facetRay.create(
		'ray:init',
		[
			// default state.
			gleam_facet.create( ),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill', gleam_color.rgba( 255, 235, 210, 0.7 ),
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


genericButtonModel =
	widget_button.abstract(
		'facets', genericButtonFacets,
		'font', shell_fontPool.get( 16, 'cm' ),
		'shape', 'ellipse'
	);


gruga_createDisc =
	disc_createDisc.abstract(
		'size',
			gleam_size.create(
				'width', 176,
				'height', 1010
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
							'color', gleam_color.rgba( 255, 255, 205, 0.955 )
						)
					)
			),
		'shape',
			euclid_ellipse.create(
				'pnw', euclid_point.xy( -2175, -1175 ),
				'pse', euclid_point.xy( 175, 1175 ),
				'gradientPC', euclid_point.xy( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add',
		'createNote',
			genericButtonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', noteButtonPnw,
						'pse', noteButtonPnw.add( genericButtonSize )
					),
				'text', 'Note'
			),
		'twig:add',
		'createLabel',
			genericButtonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', labelButtonPnw,
						'pse', labelButtonPnw.add( genericButtonSize )
					),
				'text', 'Label'
			),
		'twig:add',
		'createRelation',
			genericButtonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', relationButtonPnw,
						'pse', relationButtonPnw.add( genericButtonSize )
					),
				'text', 'Rela-\ntion',
				'textNewline', 20
			),
		'twig:add',
		'createPortal',
			genericButtonModel.abstract(
				'area',
					euclid_rect.create(
						'pnw', portalButtonPnw,
						'pse', portalButtonPnw.add( genericButtonSize )
					),
				'text', 'Portal'
			)
	);


} )( );
