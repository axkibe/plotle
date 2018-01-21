/*
| Selection.
*/
'use strict';


var
	gleam_border,
	gleam_color,
	gleam_facet;


tim.define( module, 'gruga_selection', ( def, gruga_selection ) => {


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 243, 203, 255, 0.9 ),
		'border', gleam_border.simpleBlack
	);


} );

