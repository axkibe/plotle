/*
| The select rectangle.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_border = tim.require( '../gleam/border' );

const gleam_color = tim.require( '../gleam/color' );

const gleam_facet = tim.require( '../gleam/facet' );


/*
| The frame main facet.
*/
def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'border',
			gleam_border.create(
				'color', gleam_color.rgba( 255, 215, 114, 0.9 ),
				'width', 2
			)
	);


} );

