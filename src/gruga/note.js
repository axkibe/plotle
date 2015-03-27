/*
| Default note.
*/


var
	design_facet,
	design_facetRay,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	gradient_askew,
	gradient_colorStop,
	gruga_note;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_note =
	design_facetRay.create(
		'ray:append',
		// default
		design_facet.create(
			'fill',
				gradient_askew.create(
					'ray:append',
					gradient_colorStop.create(
						'offset', 0,
						'color', euclid_color.rgba( 255, 255, 248, 0.955 )
					),
					'ray:append',
					gradient_colorStop.create(
						'offset', 1,
						'color', euclid_color.rgba( 255, 255, 160, 0.955 )
					)
				),
			'border',
				euclid_borderRay.create(
					'ray:append',
					euclid_border.create(
						'distance', 1,
						'color', euclid_color.rgb( 255, 188, 87 )
					),
					'ray:append',
					euclid_border.simpleBlack
				)
		),
		'ray:append',
		// highlight
		design_facet.create(
			'group:init', { highlight : true },
			'border',
				euclid_border.create(
					'width', 3,
					'color', euclid_color.rgba( 255, 183, 15, 0.5 )
				)
		)
	);


} )( );