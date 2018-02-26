/*
| Selection.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 243, 203, 255, 0.9 ),
		'border', gleam_border.simpleBlack
	);


} );

