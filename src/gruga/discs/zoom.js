/*
| Default design of the zoom disc.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;

const gleam_border = tim.require( '../../gleam/border' );
const gleam_borderList = tim.require( '../../gleam/borderList' );
const gleam_color = tim.require( '../../gleam/color' );
const gleam_ellipse = tim.require( '../../gleam/ellipse' );
const gleam_facet = tim.require( '../../gleam/facet' );
const gleam_facetList = tim.require( '../../gleam/facetList' );
const gleam_gradient_colorStop = tim.require( '../../gleam/gradient/colorStop' );
const gleam_gradient_radial = tim.require( '../../gleam/gradient/radial' );
const gleam_point = tim.require( '../../gleam/point' );
const gleam_rect = tim.require( '../../gleam/rect' );
const gleam_size = tim.require( '../../gleam/size' );
const gruga_fontFace = tim.require( '../fontFace' );
const gruga_icons_zoomAll = tim.require( '.././icons/zoomAll' );
const gruga_icons_zoomHome = tim.require( '.././icons/zoomHome' );
const gruga_icons_zoomIn = tim.require( '.././icons/zoomIn' );
const gruga_icons_zoomOut = tim.require( '.././icons/zoomOut' );
const layout_button = tim.require( '../../layout/button' );
const layout_disc = tim.require( '../../layout/disc' );


def.staticLazy.layout =
	function( )
{
	const pw = gleam_point.createXY( 0, 505 );

	const zoomAllButtonPos = pw.add( 100, -91 );

	const zoomInButtonPos = pw.add( 102, -42 );

	const zoomOutButtonPos = pw.add( 102, 7 );

	const zoomHomeButtonPos = pw.add( 100, 56 );

	const genericButtonSize = gleam_size.wh( 44, 44 );

	const genericButtonFacets =
		gleam_facetList.create(
			'list:init',
			[
				// default state.
				gleam_facet.create(
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


	return( layout_disc.create(
		'size', gleam_size.wh( 176, 1010 ),
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
						gleam_border.create( 'color', gleam_color.rgb( 94, 94, 0 ) )
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
				'pos', gleam_point.createXY( -2149, -1149 ),
				'width', 2298,
				'height', 2298,
				'gradientPC', gleam_point.createXY( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add',
		'zoomAll',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'iconShape', gruga_icons_zoomAll.shape,
				'iconFacet', gruga_icons_zoomAll.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.createPosSize( zoomAllButtonPos, genericButtonSize )
			),
		'twig:add',
		'zoomIn',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'iconShape', gruga_icons_zoomIn.shape,
				'iconFacet', gruga_icons_zoomIn.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.createPosSize( zoomInButtonPos, genericButtonSize )
			),
		'twig:add',
		'zoomOut',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'iconShape', gruga_icons_zoomOut.shape,
				'iconFacet', gruga_icons_zoomOut.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.createPosSize( zoomOutButtonPos, genericButtonSize )
			),
		'twig:add',
		'zoomHome',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'iconShape', gruga_icons_zoomHome.shape,
				'iconFacet', gruga_icons_zoomHome.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.createPosSize( zoomHomeButtonPos, genericButtonSize )
			)
	) );
};


} );

