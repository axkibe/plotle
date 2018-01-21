/*
| The alteration frame.
*/
'use strict';


var
	gleam_border,
	gleam_color,
	gleam_facet;


tim.define( module, 'gruga_frame', ( def, gruga_frame ) => {


/*
| The frame main facet.
*/
def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill',
			gleam_color.rgba( 255, 245, 200, 0.9 ),
			/*
			gleam_gradient_radial.create(
				'list:append',
				gleam_gradient_colorStop.create(
					'offset', 0,
					'color', gleam_color.rgba( 255, 245, 200, 0.9 )
				),
				'list:append',
				gleam_gradient_colorStop.create(
					'offset', 1,
					'color', gleam_color.rgba( 255, 235, 180, 0.9 )
				)
			),
			*/
		'border',
			gleam_border.create(
				'color', gleam_color.rgba( 255, 220, 157, 0.9 )
			)
	);


/*
| The frame handle facet.
*/
def.staticLazy.handleFacet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 220, 157, 0.955 )
	);

/*
| The frames width.
*/
def.static.width = 36;


/*
| The handles size
*/
def.static.handleSize = 53;


} );

