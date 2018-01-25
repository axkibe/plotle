/*
| Default design for the the move-to-form.
*/
'use strict';


tim.define( module, 'gruga_moveTo', ( def, gruga_moveTo ) => {


const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_facetList = require( '../gleam/facetList' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_transform = require( '../gleam/transform' );

const form_moveTo = require( '../form/moveTo' );

const shell_fontPool = require( '../shell/fontPool' );

const widget_button = require( '../widget/button' );

const widget_label = require( '../widget/label' );

const widget_scrollbox = require( '../widget/scrollbox' );


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
| TODO
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
| Layout
*/
def.staticLazy.layout = ( ) =>
	form_moveTo.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', 'go to another space',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.zero
			),
		'twig:add',
		'scrollbox',
			widget_scrollbox.abstract(
				'zone',
					gleam_rect.create(
						// this are all dummy values overridden
						// by moveTo initializer
						'pos', gleam_point.zero,
						'width', 100,
						'height', 100
					),
				'twig:add',
				'ideoloom:home',
					widget_button.create(
						'facets', gruga_moveTo._portalButtonFacets,
						'zone', gruga_moveTo._buttonSize,
						'text', 'ideoloom\nhome',
						'textNewline', 25,
						'font', shell_fontPool.get( 14, 'cm' ),
						'shape', 'ellipse',
						'transform', gleam_transform.normal
				),
				'twig:add',
				'ideoloom:sandbox',
					widget_button.create(
						'facets', gruga_moveTo._portalButtonFacets,
						'zone', gruga_moveTo._buttonSize,
						'text', 'ideoloom\nsandbox',
						'textNewline', 25,
						'font', shell_fontPool.get( 14, 'cm' ),
						'shape', 'ellipse',
						'transform', gleam_transform.normal
					)
		)
	);


/*
| template of the user space list buttons.
*/
def.staticLazy.spaceButtonTemplate = ( ) =>
	widget_button.abstract(
		'facets', gruga_moveTo._portalButtonFacets,
		'zone', gruga_moveTo._buttonSize,
		'textNewline', 25,
		'font', shell_fontPool.get( 14, 'cm' ),
		'shape', 'ellipse'
	);



} );

