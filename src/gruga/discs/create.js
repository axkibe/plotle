/*
| Default design of the creation disc.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_border = tim.require( '../../gleam/border' );
const gleam_borderList = tim.require( '../../gleam/borderList' );
const gleam_color = tim.require( '../../gleam/color' );
const gleam_ellipse = tim.require( '../../gleam/ellipse' );
const gleam_gradient_colorStop = tim.require( '../../gleam/gradient/colorStop' );
const gleam_gradient_radial = tim.require( '../../gleam/gradient/radial' );
const gleam_point = tim.require( '../../gleam/point' );
const gleam_rect = tim.require( '../../gleam/rect' );
const gleam_size = tim.require( '../../gleam/size' );
const gleam_facet = tim.require( '../../gleam/facet' );
const gleam_facetList = tim.require( '../../gleam/facetList' );
const gruga_fontFace = tim.require( '../fontFace' );
const layout_button = tim.require( '../../layout/button' );
const layout_disc = tim.require( '../../layout/disc' );


/*
| The disc layout.
*/
def.staticLazy.layout =
	function( )
{
	const pw = gleam_point.createXY( 0, 505 );

	const noteButtonPos = pw.add( 65, -325 );

	const labelButtonPos = pw.add( 81, -254 );

	const lineButtonPos = pw.add( 92, -183 );

	const arrowButtonPos = pw.add( 99, -112 );

	const relationButtonPos = pw.add( 102, -41 );

	const portalButtonPos = pw.add( 100, 30 );

	const genericButtonSize = gleam_size.wh( 70, 70 );

	const genericButtonFacets =
		gleam_facetList.create(
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
				'pos', gleam_point.createXY( -2175, -1175 ),
				'width', 2350,
				'height', 2350,
				'gradientPC', gleam_point.createXY( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add',
		'createNote',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'shape', 'ellipse',
				'text', 'Note',
				'zone', gleam_rect.createPosSize( noteButtonPos, genericButtonSize )
			),
		'twig:add',
		'createLabel',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'shape', 'ellipse',
				'text', 'Label',
				'zone', gleam_rect.createPosSize( labelButtonPos, genericButtonSize )
			),
		'twig:add',
		'createLine',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'shape', 'ellipse',
				'text', 'Line',
				'textNewline', 20,
				'zone', gleam_rect.createPosSize( lineButtonPos, genericButtonSize )
			),
		'twig:add',
		'createArrow',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'shape', 'ellipse',
				'text', 'Arrow',
				'textNewline', 20,
				'zone', gleam_rect.createPosSize( arrowButtonPos, genericButtonSize )
			),
		'twig:add',
		'createRelation',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'shape', 'ellipse',
				'text', 'Rela-\ntion',
				'textNewline', 20,
				'zone', gleam_rect.createPosSize( relationButtonPos, genericButtonSize )
			),
		'twig:add',
		'createPortal',
			layout_button.create(
				'facets', genericButtonFacets,
				'fontFace', gruga_fontFace.standard( 16 ),
				'shape', 'ellipse',
				'text', 'Portal',
				'zone', gleam_rect.createPosSize( portalButtonPos, genericButtonSize )
			)
	) );
};


} );
