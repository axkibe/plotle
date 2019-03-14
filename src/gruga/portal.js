/*
| Default portal.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_border = tim.require( '../gleam/border' );

const gleam_borderList = tim.require( '../gleam/borderList' );

const gleam_color = tim.require( '../gleam/color' );

const gleam_facet = tim.require( '../gleam/facet' );

const gleam_facetList = tim.require( '../gleam/facetList' );

const gleam_gradient_radial = tim.require( '../gleam/gradient/radial' );

const gleam_gradient_colorStop = tim.require( '../gleam/gradient/colorStop' );

const gleam_size = tim.require( '../gleam/size' );

const gruga_highlight = tim.require( './highlight' );


def.staticLazy.facets = ( ) =>
	gleam_facetList.create(
		'list:append',
		// default
		gleam_facet.create(
			'fill',
				gleam_gradient_radial.create(
					'list:append',
					gleam_gradient_colorStop.create(
						'offset', 0,
						'color', gleam_color.rgba( 255, 255, 248, 0.955 )
					),
					'list:append',
					gleam_gradient_colorStop.create(
						'offset', 1,
						'color', gleam_color.rgba( 255, 255, 160, 0.955 )
					)
				),
			'border',
				gleam_borderList.create(
					'list:append',
					gleam_border.create(
						'distance', 3,
						'width', 6,
						'color', gleam_color.rgb( 255, 220, 128 )
					),
					'list:append',
					gleam_border.simpleBlack
				)
		),
		'list:append', gruga_highlight.facet
	);


/*
| Facet design of buttons for the moveto form
| and on the portal.
*/
def.staticLazy.buttonFacets = ( ) =>
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
| Facet design of input fields on the portal.
*/
def.staticLazy.inputFacets = ( ) =>
	gleam_facetList.create(
		'list:init',
		[
			// default state.
			gleam_facet.create(
				'fill', gleam_color.white,
				'border',
					gleam_border.create(
						'color', gleam_color.rgb( 255, 219, 165 )
					)
			)
		]
	);


def.static.inputRounding = 3;

def.static.inputPitch = 5;


/*
| Minimum size of the portal.
*/
def.staticLazy.minSize = ( ) =>
	gleam_size.wh( 40, 40 );


/*
| MoveTo button on the portal
*/
def.static.moveToWidth = 80;

def.static.moveToHeight = 22;

def.static.moveToRounding = 11;


} );
