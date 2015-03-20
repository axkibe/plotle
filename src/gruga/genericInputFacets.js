/*
| Default button.
*/


var
	design_facet,
	design_facetRay,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	gruga_genericInputFacets;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_genericInputFacets =
	design_facetRay.create(
		'ray:init',
		[
			// default state.
			design_facet.create(
				'fill', euclid_color.white,
				'border',
					euclid_borderRay.create(
						'ray:append',
						euclid_border.create(
							'distance', 1,
							'width', 1.5,
							'color', euclid_color.rgb( 255, 188, 87 )
						),
						'ray:append',
						euclid_border.simpleBlack
					)
			),
			// focus
			design_facet.create(
				'group:init', { 'focus' : true },
				'fill', euclid_color.white,
				'border',
					euclid_borderRay.create(
						'ray:append',
						euclid_border.create(
							'distance', 1,
							'width', 2,
							'color', euclid_color.rgb( 255, 99, 188 )
						),
						'ray:append',
						euclid_border.simpleBlack
					)
			),
		]
	);


})( );
