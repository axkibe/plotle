/*
| Default design of the creation disc.
*/
'use strict';


tim.define( module, 'gruga_createDisc', ( def, gruga_createDisc ) => {


const disc_createDisc = require( '../disc/createDisc' );

const gleam_border = require( '../gleam/border' );

const gleam_borderList = require( '../gleam/borderList' );

const gleam_color = require( '../gleam/color' );

const gleam_ellipse = require( '../gleam/ellipse' );

const gleam_gradient_colorStop = require( '../gleam/gradient/colorStop' );

const gleam_gradient_radial = require( '../gleam/gradient/radial' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_size = require( '../gleam/size' );

const gleam_facet = require( '../gleam/facet' );

const gleam_facetList = require( '../gleam/facetList' );

const shell_fontPool = require( '../shell/fontPool' );

const widget_button = require( '../widget/button' );


const pw = gleam_point.xy( 0, 505 );

const noteButtonPnw = pw.add( 65, -325 );

const labelButtonPnw = pw.add( 81, -254 );

const relationButtonPnw = pw.add( 92, -183 );

const portalButtonPnw = pw.add( 99, -112 );

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


const genericButtonModel =
	widget_button.abstract(
		'facets', genericButtonFacets,
		'font', shell_fontPool.get( 16, 'cm' ),
		'shape', 'ellipse'
	);



/*
| The createDisc layout.
*/
def.staticLazy.layout = ( ) =>
	disc_createDisc.abstract(
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


} );
