/*
| Default button.
*/


var
	euclid_border,
	euclid_borderRay,
	gleam_color,
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
				'fill', gleam_color.white,
				'border',
					euclid_borderRay.create(
						'ray:append',
						euclid_border.create(
							'distance', 1,
							'width', 1.5,
							'color', gleam_color.rgb( 255, 188, 87 )
						),
						'ray:append',
						euclid_border.simpleBlack
					)
			),
			// focus
			euclid_facet.create(
				'group:init', { 'focus' : true },
				'fill', gleam_color.white,
				'border',
					euclid_borderRay.create(
						'ray:append',
						euclid_border.create(
							'distance', 1,
							'width', 2,
							'color', gleam_color.rgb( 255, 99, 188 )
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
