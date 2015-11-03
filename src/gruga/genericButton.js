/*
| Default button.
*/


var
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_facet,
	euclid_facetRay,
	gruga_genericButton;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_genericButton = { };


gruga_genericButton.facets =
	euclid_facetRay.create(
		'ray:init',
		[
			// default state.
			euclid_facet.create(
				'fill', euclid_color.rgba( 255, 255, 240, 0.7 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 2,
						'color', euclid_color.rgba( 196, 94, 44, 0.7 )
					)
			),
			// hover
			euclid_facet.create(
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
			euclid_facet.create(
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
			euclid_facet.create(
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


if( FREEZE )
{
	Object.freeze( gruga_genericButton );
}


} )( );
