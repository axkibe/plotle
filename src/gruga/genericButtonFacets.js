/*
| Default button.
*/


var
	design_facet,
	design_facetRay,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	gruga_genericButtonFacets;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_genericButtonFacets =
	design_facetRay.create(
		'ray:init',
		[
			// default state.
			design_facet.create(
				'fill', euclid_color.rgba( 255, 255, 240, 0.7 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 2,
						'color', euclid_color.rgba( 196, 94, 44, 0.7 )
					)
			),
			// hover
			design_facet.create(
				'group:init', { 'hover' : true },
				'fill', euclid_color.rgba( 255, 235, 210, 0.7 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 2,
						'color', euclid_color.rgba( 196, 94, 44, 0.7 )
					)
			),
			// focus
			design_facet.create(
				'group:init', { 'focus' : true },
				'fill', euclid_color.rgba( 255, 255, 240, 0.7 ),
				'border',
					euclid_borderRay.create(
						'ray:append',
						euclid_border.create(
							'distance', 2,
							'width', 1.5,
							'color', euclid_color.rgb( 255, 99, 188 )
						),
						'ray:append',
						euclid_border.create(
							'distance', 1,
							'width', 2,
							'color', euclid_color.rgba( 196, 94, 44, 0.7 )
						)
				)
			),
			// focus and hover
			design_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', euclid_color.rgba( 255, 235, 210, 0.7 ),
				'border',
					euclid_borderRay.create(
						'ray:append',
						euclid_border.create(
							'distance', 2,
							'width', 1.5,
							'color', euclid_color.rgb( 255, 99, 188 )
						),
						'ray:append',
						euclid_border.create(
							'distance', 1,
							'width', 2,
							'color', euclid_color.rgba( 196, 94, 44, 0.7 )
						)
					)
			)
		]
	);


} )( );
