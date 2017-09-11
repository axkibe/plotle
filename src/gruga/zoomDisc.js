/*
| Default design of the zoom disc.
*/


var
	disc_zoomDisc,
	gleam_border,
	gleam_borderList,
	gleam_color,
	gleam_ellipse,
	gleam_facet,
	gleam_facetList,
	gleam_gradient_colorStop,
	gleam_gradient_radial,
	gleam_point,
	gleam_rect,
	gleam_size,
	gruga_iconZoomAll,
	gruga_iconZoomHome,
	gruga_iconZoomIn,
	gruga_iconZoomOut,
	gruga_zoomDisc,
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
	pw,
	zoomAllButtonPos,
	zoomInButtonPos,
	zoomOutButtonPos,
	zoomHomeButtonPos;


pw = gleam_point.xy( 0, 505 );

zoomAllButtonPos = pw.add( 100, -91 );

zoomInButtonPos = pw.add( 102, -42 );

zoomOutButtonPos = pw.add( 102, 7 );

zoomHomeButtonPos = pw.add( 100, 56 );

genericButtonSize = gleam_size.wh( 44, 44 );

genericButtonFacets =
	gleam_facetList.create(
		'list:init',
		[
			// default state.
			gleam_facet.create(
//				'fill', gleam_color.rgba( 255, 235, 210, 0.7 ),
//				'border',
//					gleam_border.create(
//						'color', gleam_color.rgba( 196, 94, 44, 0.4 )
//					)
			),
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


gruga_zoomDisc =
	disc_zoomDisc.abstract(
		'size',
			gleam_size.create(
				'width', 176,
				'height', 1010
			),
		'facet',
			gleam_facet.create(
				'border',
					gleam_borderList.create(
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
				'pos', gleam_point.xy( -2149, -1149 ),
				'width', 2298,
				'height', 2298,
				'gradientPC', gleam_point.xy( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add',
		'zoomAll',
			genericButtonModel.abstract(
				'iconShape', gruga_iconZoomAll.shape,
				'iconFacet', gruga_iconZoomAll.facet,
				'zone',
					gleam_rect.posSize(
						zoomAllButtonPos,
						genericButtonSize
					)
			),
		'twig:add',
		'zoomIn',
			genericButtonModel.abstract(
				'iconShape', gruga_iconZoomIn.shape,
				'iconFacet', gruga_iconZoomIn.facet,
				'zone',
					gleam_rect.posSize(
						zoomInButtonPos,
						genericButtonSize
					)
			),
		'twig:add',
		'zoomOut',
			genericButtonModel.abstract(
				'iconShape', gruga_iconZoomOut.shape,
				'iconFacet', gruga_iconZoomOut.facet,
				'zone',
					gleam_rect.posSize(
						zoomOutButtonPos,
						genericButtonSize
					)
			),
		'twig:add',
		'zoomHome',
			genericButtonModel.abstract(
				'iconShape', gruga_iconZoomHome.shape,
				'iconFacet', gruga_iconZoomHome.facet,
				'zone',
					gleam_rect.posSize(
						zoomHomeButtonPos,
						genericButtonSize
					)
			)
	);


if( FREEZE ) Object.freeze( gruga_zoomDisc );


} )( );
