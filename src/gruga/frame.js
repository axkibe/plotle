/*
| The alteration frame.
*/


var
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_gradient_colorStop,
	gleam_gradient_radial,
	gruga_frame;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_frame = { };


/*
| The frame main facet.
*/
gruga_frame.facet =
	gleam_facet.create(
		'fill',
			gleam_gradient_radial.create(
				'ray:append',
				gleam_gradient_colorStop.create(
					'offset', 0,
					'color', gleam_color.rgba( 255, 245, 200, 0.9 )
				),
				'ray:append',
				gleam_gradient_colorStop.create(
					'offset', 1,
					'color', gleam_color.rgba( 255, 235, 180, 0.9 )
				)
			),
		'border',
			gleam_border.create(
				'color', gleam_color.rgba( 255, 220, 157, 0.9 )
			)
	);


/*
| The frame handle facet.
*/
gruga_frame.handleFacet =
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 220, 157, 0.955 )
	);

/*
| The frames width.
*/
gruga_frame.width = 26;


/*
| The handles size
*/
gruga_frame.handleSize = 53;


if( FREEZE ) Object.freeze( gruga_frame );


} )( );
