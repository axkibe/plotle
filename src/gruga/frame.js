/*
| The alteration frame.
*/


var
	euclid_border,
	euclid_color,
	euclid_facet,
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
	euclid_facet.create(
		'fill',
			euclid_gradient_radial.create(
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 0,
					'color', euclid_color.rgba( 255, 255, 255, 0.5 )
				),
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 1,
					'color', euclid_color.rgba( 255, 255, 200, 0.7 )
				)
			),
		'border',
			euclid_border.create(
				'color', euclid_color.rgba( 255, 230, 167, 0.8 )
			)
	);


/*
| The frame handle facet.
*/
gruga_frame.handleFacet =
	euclid_facet.create(
		'fill', euclid_color.rgba( 255, 230, 167, 0.955 ),
		'border',
			euclid_border.create(
				'color', euclid_color.rgba( 255, 180, 110, 0.9 )
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
