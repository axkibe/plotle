/*
| Default design of the creation disc.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_border = require( '../../gleam/border' );

const gleam_borderList = require( '../../gleam/borderList' );

const gleam_color = require( '../../gleam/color' );

const gleam_ellipse = require( '../../gleam/ellipse' );

const gleam_gradient_colorStop = require( '../../gleam/gradient/colorStop' );

const gleam_gradient_radial = require( '../../gleam/gradient/radial' );

const gleam_point = require( '../../gleam/point' );

const gleam_rect = require( '../../gleam/rect' );

const gleam_size = require( '../../gleam/size' );

const gleam_facet = require( '../../gleam/facet' );

const gleam_facetList = require( '../../gleam/facetList' );

const layout_button = require( '../../layout/button' );

const layout_disc = require( '../../layout/disc' );

const shell_fontPool = require( '../../shell/fontPool' );


/*
| The disc layout.
*/
def.staticLazy.layout =
	function( )
{
	const pw = gleam_point.xy( 0, 505 );

	const noteButtonPos = pw.add( 65, -325 );

	const labelButtonPos = pw.add( 81, -254 );

	const relationButtonPos = pw.add( 92, -183 );
//	const lineButtonPos = pw.add( 92, -183 );

	const portalButtonPos = pw.add( 99, -112 );
//	const arrowButtonPos = pw.add( 99, -112 );

//	const relationButtonPos = pw.add( 102, -41 );

//	const portalButtonPos = pw.add( 100, 30 );

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
				'pos', gleam_point.xy( -2175, -1175 ),
				'width', 2350,
				'height', 2350,
				'gradientPC', gleam_point.xy( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add',
		'createNote',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'shape', 'ellipse',
				'text', 'Note',
				'zone', gleam_rect.posSize( noteButtonPos, genericButtonSize )
			),
		'twig:add',
		'createLabel',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'shape', 'ellipse',
				'text', 'Label',
				'zone', gleam_rect.posSize( labelButtonPos, genericButtonSize )
			),
		/*
		'twig:add',
		'createLine',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'shape', 'ellipse',
				'text', 'Line',
				'textNewline', 20,
				'zone', gleam_rect.posSize( lineButtonPos, genericButtonSize )
			),
		'twig:add',
		'createArrow',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'shape', 'ellipse',
				'text', 'Arrow',
				'textNewline', 20,
				'zone', gleam_rect.posSize( arrowButtonPos, genericButtonSize )
			),
		*/
		'twig:add',
		'createRelation',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'shape', 'ellipse',
				'text', 'Rela-\ntion',
				'textNewline', 20,
				'zone', gleam_rect.posSize( relationButtonPos, genericButtonSize )
			),
		'twig:add',
		'createPortal',
			layout_button.create(
				'facets', genericButtonFacets,
				'font', shell_fontPool.get( 16, 'cm' ),
				'shape', 'ellipse',
				'text', 'Portal',
				'zone', gleam_rect.posSize( portalButtonPos, genericButtonSize )
			)
	) );
};


} );
