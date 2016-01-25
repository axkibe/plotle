/*
| The alteration frame.
*/


var
	euclid_border,
	gleam_color,
	gleam_facet,
	euclid_gradient_colorStop,
	euclid_gradient_radial,
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
			euclid_gradient_radial.create(
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 0,
					'color', gleam_color.rgba( 255, 255, 255, 0.5 )
				),
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 1,
					'color', gleam_color.rgba( 255, 255, 200, 0.7 )
				)
			),
		'border',
			euclid_border.create(
				'color', gleam_color.rgba( 255, 230, 167, 0.8 )
			)
	);


/*
| The frame handle facet.
*/
gruga_frame.handleFacet =
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 230, 167, 0.955 ),
		'border',
			euclid_border.create(
				'color', gleam_color.rgba( 255, 180, 110, 0.9 )
			)
	);

/*
| The frames width. 
*/
gruga_frame.width = 21;


/*
| The handles size
*/
gruga_frame.handleSize = 38;


if( FREEZE ) Object.freeze( gruga_frame );


} )( );
