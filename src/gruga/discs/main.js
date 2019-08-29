/*
| Default design for the main disc.
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
const gruga_iconNormal = tim.require( '../icons/normal' );
const gruga_iconRemove = tim.require( '../icons/remove' );
const gruga_iconSelect = tim.require( '../icons/select' );
const gruga_iconZoom = tim.require( '../icons/zoom' );
const layout_button = tim.require( '../../layout/button' );
const layout_disc = tim.require( '../../layout/disc' );



def.staticLazy.layout =
	function( )
{
	const pw = gleam_point.createXY( 0, 500 );

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
				'pos', gleam_point.createXY( -2101, -1100 ),
				'width', 2200,
				'height', 2200,
				'gradientPC', gleam_point.createXY( -600, 0 ),
				'gradientR1', 650
			),
		'twig:add', 'normal',
			layout_button.create(
				'facets', buttonFacets,
				'iconShape', gruga_iconNormal.shape,
				'iconFacet', gruga_iconNormal.facet,
				'shape', 'ellipse',
				'zone', gleam_rect.createPosSize( normalButtonPos, buttonSize )
			),
		'twig:add', 'select',
			layout_button.create(
				'facets', buttonFacets,
				'iconShape', gruga_iconSelect.shape,
				'iconFacet', gruga_iconSelect.facet,
				'shape', 'ellipse',
				'visible', false,
				'zone', gleam_rect.createPosSize( selectButtonPos, buttonSize )
			),
		'twig:add', 'create',
			layout_button.create(
				'facets', buttonFacets,
				'fontFace', gruga_fontFace.standard( 13 ),
				'shape', 'ellipse',
				'text', 'new',
				'visible', false,
				'zone', gleam_rect.createPosSize( createButtonPos, buttonSize )
			),
		'twig:add', 'remove',
			layout_button.create(
				'facets', buttonFacets,
				'iconShape', gruga_iconRemove.shape,
				'iconFacet', gruga_iconRemove.facet,
				'shape', 'ellipse',
				'visible', false,
				'zone', gleam_rect.createPosSize( removeButtonPos, buttonSize )
			),
		'twig:add', 'moveTo',
			layout_button.create(
				'facets', buttonFacets,
				'fontFace', gruga_fontFace.standard( 13 ),
				'shape', 'ellipse',
				'text', 'go',
				'visible', false,
				'zone', gleam_rect.createPosSize( movetoButtonPos, buttonSize )
			),
		'twig:add', 'zoom',
			layout_button.create(
				'facets', buttonFacets,
				'iconShape', gruga_iconZoom.shape,
				'iconFacet', gruga_iconZoom.facet,
				'shape', 'ellipse',
				'visible', false,
				'zone', gleam_rect.createPosSize( zoomButtonPos, buttonSize )
			),
		'twig:add', 'space',
			layout_button.create(
				'facets', buttonFacets,
				'fontFace', gruga_fontFace.standard( 13 ),
				'shape',
					gleam_ellipse.createPosSize(
						gleam_point.createXY( -60, 0 ),
						spaceButtonSize.add( 60 - 1, -1 )
					),
				'text', '',
				'textRotation', - Math.PI / 2,
				'zone', gleam_rect.createPosSize( spaceButtonPos, spaceButtonSize )
			),
		'twig:add', 'user',
			layout_button.create(
				'facets', buttonFacets,
				'fontFace', gruga_fontFace.standard( 12 ),
				'shape',
					gleam_ellipse.createPosSize(
						gleam_point.createXY( -70, 0 ),
						userButtonSize.add( 70 - 1, -1 )
					),
				'text', '',
				'textRotation', ( -Math.PI / 2 ),
				'zone', gleam_rect.createPosSize( userButtonPos, userButtonSize )
			),
		'twig:add', 'login',
			layout_button.create(
				'facets', buttonFacets,
				'fontFace', gruga_fontFace.standard( 13 ),
				'shape', 'ellipse',
				'text', 'log\nin',
				'textNewline', 14,
				'visible', false,
				'zone', gleam_rect.createPosSize( loginButtonPos, buttonSize )
			),
		'twig:add', 'signUp',
			layout_button.create(
				'facets', buttonFacets,
				'fontFace', gruga_fontFace.standard( 13 ),
				'shape', 'ellipse',
				'text', 'sign\nup',
				'textNewline', 14,
				'visible', false,
				'zone', gleam_rect.createPosSize( signupButtonPos, buttonSize )
			)
	) );
};


} );

