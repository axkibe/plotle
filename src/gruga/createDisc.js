/*
| Default design of the creation disc.
*/


var
	disc_createDisc,
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


pw = gleam_point.xy( 0, 505 );

noteButtonPnw = pw.add( 65, -325 );

labelButtonPnw = pw.add( 81, -254 );

relationButtonPnw = pw.add( 92, -183 );

portalButtonPnw = pw.add( 99, -112 );

genericButtonSize = gleam_size.wh( 70, 70 );

genericButtonFacets =
	gleam_facetRay.create(
		'list:init',
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
						'list:append',
						gleam_border.create(
							'distance', 1,
							'color', gleam_color.rgb( 255, 94, 44 )
						),
						'list:append',
						gleam_border.create(
							'color', gleam_color.rgb( 94, 94, 0 )
						)
					),
				'fill',
					gleam_gradient_radial.create(
						'list:append',
						gleam_gradient_colorStop.create(
							'offset', 0,
							'color', gleam_color.rgba( 255, 255,  20, 0.955 )
						),
						'list:append',
						gleam_gradient_colorStop.create(
							'offset', 1,
							'color', gleam_color.rgba( 255, 255, 205, 0.955 )
						)
					)
			),
		'shape',
			gleam_ellipse.create(
				'pos', gleam_point.xy( -2175, -1175 ),
				'width', 2350,
				'height', 2350,
				'gradientPC', gleam_point.xy( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add',
		'createNote',
			genericButtonModel.abstract(
				'zone', gleam_rect.posSize( noteButtonPnw, genericButtonSize ),
				'text', 'Note'
			),
		'twig:add',
		'createLabel',
			genericButtonModel.abstract(
				'zone', gleam_rect.posSize( labelButtonPnw, genericButtonSize ),
				'text', 'Label'
			),
		'twig:add',
		'createRelation',
			genericButtonModel.abstract(
				'zone',
					gleam_rect.posSize( relationButtonPnw, genericButtonSize ),
				'text', 'Rela-\ntion',
				'textNewline', 20
			),
		'twig:add',
		'createPortal',
			genericButtonModel.abstract(
				'zone',
					gleam_rect.posSize(
						portalButtonPnw,
						genericButtonSize
					),
				'text', 'Portal'
			)
	);


if( FREEZE ) Object.freeze( gruga_createDisc );


} )( );
