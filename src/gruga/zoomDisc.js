/*
| Default design of the zoom disc.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_border = require( '../gleam/border' );

const gleam_borderList = require( '../gleam/borderList' );

const gleam_color = require( '../gleam/color' );

const gleam_ellipse = require( '../gleam/ellipse' );

const gleam_facet = require( '../gleam/facet' );

const gleam_facetList = require( '../gleam/facetList' );

const gleam_gradient_colorStop = require( '../gleam/gradient/colorStop' );

const gleam_gradient_radial = require( '../gleam/gradient/radial' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_size = require( '../gleam/size' );

const gruga_iconZoomAll = require( './iconZoomAll' );

const gruga_iconZoomHome = require( './iconZoomHome' );

const gruga_iconZoomIn = require( './iconZoomIn' );

const gruga_iconZoomOut = require( './iconZoomOut' );

const layout_button = require( '../layout/button' );

const layout_disc = require( '../layout/disc' );

const shell_fontPool = require( '../shell/fontPool' );


def.staticLazy.layout =
	function( )
{
	const pw = gleam_point.xy( 0, 505 );

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
				'pos', gleam_point.xy( -2149, -1149 ),
				'width', 2298,
				'height', 2298,
				'gradientPC', gleam_point.xy( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add',
		'zoomAll',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'iconShape', gruga_iconZoomAll.shape,
				'iconFacet', gruga_iconZoomAll.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.posSize( zoomAllButtonPos, genericButtonSize )
			),
		'twig:add',
		'zoomIn',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'iconShape', gruga_iconZoomIn.shape,
				'iconFacet', gruga_iconZoomIn.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.posSize( zoomInButtonPos, genericButtonSize )
			),
		'twig:add',
		'zoomOut',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'iconShape', gruga_iconZoomOut.shape,
				'iconFacet', gruga_iconZoomOut.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.posSize( zoomOutButtonPos, genericButtonSize )
			),
		'twig:add',
		'zoomHome',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'iconShape', gruga_iconZoomHome.shape,
				'iconFacet', gruga_iconZoomHome.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.posSize( zoomHomeButtonPos, genericButtonSize )
			)
	) );
};


} );

