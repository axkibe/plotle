/*
| Default button.
*/


var
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_facet,
	euclid_facetRay,
	gruga_genericInput;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_genericInput = { };


gruga_genericInput.facets =
	euclid_facetRay.create(
		'ray:init',
		[
			// default state.
			euclid_facet.create(
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
			euclid_facet.create(
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
			)
		]
	);


if( FREEZE )
{
	Object.freeze( gruga_genericInput );
}


})( );
