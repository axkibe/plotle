/*
| Default portal.
*/


var
	design_facet,
	design_facetRay,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_gradient_radial,
	euclid_gradient_colorStop,
	gruga_portal;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_portal =
	design_facetRay.create(
		'ray:append',
		// default
		design_facet.create(
			'fill',
				euclid_gradient_radial.create(
					'ray:append',
					euclid_gradient_colorStop.create(
						'offset', 0,
						'color', euclid_color.rgba( 255, 255, 248, 0.955 )
					),
					'ray:append',
					euclid_gradient_colorStop.create(
						'offset', 1,
						'color', euclid_color.rgba( 255, 255, 160, 0.955 )
					)
				),
			'border',
				euclid_borderRay.create(
					'ray:append',
					euclid_border.create(
						'distance', 3,
						'width', 6,
						'color', euclid_color.rgb( 255, 220, 128 )
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
