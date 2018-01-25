/*
| Highlighting of items
*/
'use strict';


tim.define( module, 'gruga_highlight', ( def, gruga_highlight ) => {


const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'group:init', { highlight : true },
		'border',
			gleam_border.create(
				'width', 3,
				'color', gleam_color.rgba( 255, 170, 0, 0.45 ),
				'distance', -1
			)
	);


} );

