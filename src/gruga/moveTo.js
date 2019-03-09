/*
| Default design for the the move-to-form.
*/
'use strict';


tim.define( module, ( def, gruga_moveTo ) => {


const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_facetList = require( '../gleam/facetList' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_font = require( '../gruga/font' );

const layout_button = require( '../layout/button' );

const layout_form = require( '../layout/form' );

const layout_label = require( '../layout/label' );

const layout_scrollbox = require( '../layout/scrollbox' );


/*
| Size of a button.
*/
def.staticLazy._buttonSize = ( ) =>
	gleam_rect.create(
		'pos', gleam_point.zero, // dummy
		'width', 130,
		'height', 130
	);


/*
| Facets of the portal buttons.
*/
def.staticLazy._portalButtonFacets = ( ) =>
	gleam_facetList.create(
		'list:init',
		[
			// default state.
			gleam_facet.create(
				'group:init', { },
				'fill', gleam_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgb( 255, 141, 66 )
					)
			),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill', gleam_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					gleam_border.create(
						'width', 1.5,
						'color', gleam_color.rgb( 255, 141, 66 )
					)
			),
			// focus
			gleam_facet.create(
				'group:init', { 'focus' : true },
				'fill', gleam_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					gleam_border.create(
						'distance', 1,
						'width', 1.5,
						'color', gleam_color.rgb( 255, 99, 188 )
					)
			),
			// focus and hover
			gleam_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', gleam_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					gleam_border.create(
						'distance', 1,
						'width', 1.5,
						'color', gleam_color.rgb( 255, 99, 188 )
					)
			)
		]
	);


/*
| Layout.
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add',
		'headline',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 22 ),
				'pos', gleam_point.zero,
				'text', 'go to another space',
			),
		'twig:add',
		'scrollbox',
			layout_scrollbox.create(
				'zone',
					gleam_rect.create(
						// this are all dummy values overridden
						// by moveTo initializer
						'pos', gleam_point.zero,
						'width', 100,
						'height', 100
					),
				'twig:add',
				'plotle:home',
					layout_button.create(
						'facets', gruga_moveTo._portalButtonFacets,
						'zone', gruga_moveTo._buttonSize,
						'text', 'plotle\nhome',
						'textNewline', 25,
						'font', gruga_font.standard( 14 ),
						'shape', 'ellipse'
				),
				'twig:add',
				'plotle:sandbox',
					layout_button.create(
						'facets', gruga_moveTo._portalButtonFacets,
						'zone', gruga_moveTo._buttonSize,
						'text', 'plotle\nsandbox',
						'textNewline', 25,
						'font', gruga_font.standard( 14 ),
						'shape', 'ellipse'
					)
		)
	);


/*
| template of the user space list buttons.
*/
def.staticLazy.spaceButtonLayout = ( ) =>
	layout_button.create(
		'facets', gruga_moveTo._portalButtonFacets,
		'font', gruga_font.standard( 14 ),
		'shape', 'ellipse',
		'textNewline', 25,
		'zone', gruga_moveTo._buttonSize
	);


} );
