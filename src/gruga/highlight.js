/*
| Highlighting of items
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_border = tim.require( '../gleam/border' );

const gleam_color = tim.require( '../gleam/color' );

const gleam_facet = tim.require( '../gleam/facet' );


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

