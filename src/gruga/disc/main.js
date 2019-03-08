/*
| Default design for the main disc.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_border = require( '../../gleam/border' );

const gleam_borderList = require( '../../gleam/borderList' );

const gleam_color = require( '../../gleam/color' );

const gleam_ellipse = require( '../../gleam/ellipse' );

const gleam_facet = require( '../../gleam/facet' );

const gleam_facetList = require( '../../gleam/facetList' );

const gleam_gradient_colorStop = require( '../../gleam/gradient/colorStop' );

const gleam_gradient_radial = require( '../../gleam/gradient/radial' );

const gleam_point = require( '../../gleam/point' );

const gleam_rect = require( '../../gleam/rect' );

const gleam_size = require( '../../gleam/size' );

const gruga_iconNormal = require( '../../gruga/iconNormal' );

const gruga_iconRemove = require( '../../gruga/iconRemove' );

const gruga_iconSelect = require( '../../gruga/iconSelect' );

const gruga_iconZoom = require( '../../gruga/iconZoom' );

const layout_button = require( '../../layout/button' );

const layout_disc = require( '../../layout/disc' );

const shell_fontPool = require( '../../shell/fontPool' );


def.staticLazy.layout =
	function( )
{
	const pw = gleam_point.xy( 0, 500 );

	const buttonFacets =
		gleam_facetList.create(
			'list:init',
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

	const buttonSize = gleam_size.wh( 44, 44 );

	const loginButtonPos = pw.add( 30, 155 );

	const movetoButtonPos = pw.add( 46, -74 );

	const normalButtonPos = pw.add( 5, -324 );

	const selectButtonPos = pw.add( 19, -270 );

	const createButtonPos = pw.add( 31, -216 );

	const removeButtonPos = pw.add( 40, -162 );

	const signupButtonPos = pw.add( 17, 210 );

	const spaceButtonPos = pw.add( 0, -230 );

	const spaceButtonSize = gleam_size.wh( 28, 290 );

	const userButtonPos = pw.add( 0, 40 );

	const userButtonSize = gleam_size.wh( 24, 180 );

	const zoomButtonPos = pw.add( 48, -18 );

	return( layout_disc.create(
		'size', gleam_size.wh( 100, 1000 ),
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
			layout_button.create(
				'facets', buttonFacets,
				'iconShape', gruga_iconNormal.shape,
				'iconFacet', gruga_iconNormal.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.posSize( normalButtonPos, buttonSize )
			),
		'twig:add', 'select',
			layout_button.create(
				'facets', buttonFacets,
				'iconShape', gruga_iconSelect.shape,
				'iconFacet', gruga_iconSelect.facet,
				'shape', 'ellipse',
				'visible', false,
				'zone', gleam_rect.posSize( selectButtonPos, buttonSize )
			),
		'twig:add', 'create',
			layout_button.create(
				'facets', buttonFacets,
				'font', shell_fontPool.get( 13, 'a' ),
				'shape', 'ellipse',
				'text', 'new',
				'visible', false,
				'zone', gleam_rect.posSize( createButtonPos, buttonSize )
			),
		'twig:add', 'remove',
			layout_button.create(
				'facets', buttonFacets,
				'iconShape', gruga_iconRemove.shape,
				'iconFacet', gruga_iconRemove.facet,
				'shape', 'ellipse',
				'visible', false,
				'zone', gleam_rect.posSize( removeButtonPos, buttonSize )
			),
		'twig:add', 'moveTo',
			layout_button.create(
				'facets', buttonFacets,
				'font', shell_fontPool.get( 13, 'a' ),
				'shape', 'ellipse',
				'text', 'go',
				'visible', false,
				'zone', gleam_rect.posSize( movetoButtonPos, buttonSize )
			),
		'twig:add', 'zoom',
			layout_button.create(
				'facets', buttonFacets,
				'iconShape', gruga_iconZoom.shape,
				'iconFacet', gruga_iconZoom.facet,
				'shape', 'ellipse',
				'visible', false,
				'zone', gleam_rect.posSize( zoomButtonPos, buttonSize )
			),
		'twig:add', 'space',
			layout_button.create(
				'facets', buttonFacets,
				'font', shell_fontPool.get( 12, 'a' ),
				'shape',
					gleam_ellipse.posSize(
						gleam_point.xy( -60, 0 ),
						spaceButtonSize.add( 60 - 1, -1 )
					),
				'text', '',
				'textRotation', - Math.PI / 2,
				'zone', gleam_rect.posSize( spaceButtonPos, spaceButtonSize )
			),
		'twig:add', 'user',
			layout_button.create(
				'facets', buttonFacets,
				'font', shell_fontPool.get( 12, 'a' ),
				'shape',
					gleam_ellipse.posSize(
						gleam_point.xy( -70, 0 ),
						userButtonSize.add( 70 - 1, -1 )
					),
				'text', '',
				'textRotation', ( -Math.PI / 2 ),
				'zone', gleam_rect.posSize( userButtonPos, userButtonSize )
			),
		'twig:add', 'login',
			layout_button.create(
				'facets', buttonFacets,
				'font', shell_fontPool.get( 13, 'a' ),
				'shape', 'ellipse',
				'text', 'log\nin',
				'textNewline', 14,
				'visible', false,
				'zone', gleam_rect.posSize( loginButtonPos, buttonSize )
			),
		'twig:add', 'signUp',
			layout_button.create(
				'facets', buttonFacets,
				'shape', 'ellipse',
				'text', 'sign\nup',
				'textNewline', 14,
				'font', shell_fontPool.get( 13, 'a' ),
				'visible', false,
				'zone', gleam_rect.posSize( signupButtonPos, buttonSize )
			)
	) );
};


} );

