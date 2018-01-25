/*
| Default note.
*/
'use strict';


tim.define( module, 'gruga_note', ( def, gruga_note ) => {


const gleam_border = require( '../gleam/border' );

const gleam_borderList = require( '../gleam/borderList' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_facetList = require( '../gleam/facetList' );

const gleam_gradient_askew = require( '../gleam/gradient/askew' );

const gleam_gradient_colorStop = require( '../gleam/gradient/colorStop' );

const gleam_margin = require( '../gleam/margin' );

const gruga_highlight = require( '../gruga/highlight' );


def.staticLazy.facets = ( ) =>
	gleam_facetList.create(
		'list:append',
		// default
		gleam_facet.create(
			'fill',
				gleam_gradient_askew.create(
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
						'distance', 1,
						'color', gleam_color.rgb( 255, 188, 87 )
					),
					'list:append',
					gleam_border.simpleBlack
				)
		),
		'list:append', gruga_highlight.facet
	);


/*
| Inner distance of note to doc.
*/
def.staticLazy.innerMargin = ( ) =>
	gleam_margin.create(
		'n', 4,
		'e', 5,
		's', 4,
		'w', 5
	);


/*
| Minimum note size.
*/
def.static.minWidth = 30;

def.static.minHeight = 30;


/*
| Radius of the corners.
*/
def.static.cornerRadius = 8;


/*
| Default fontsize.
*/
def.static.defaultFontsize = 13;


/*
| Vertical distance of scrollbar from border.
*/
def.static.vScrollbarDis = 5;


} );

