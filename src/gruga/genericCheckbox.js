/*
| Default button.
*/


var
	euclid_facet,
	euclid_facetRay,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	gruga_genericCheckbox;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_genericCheckbox = { };


gruga_genericCheckbox.facets =
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
			// hover
			euclid_facet.create(
				'group:init', { 'hover' : true },
				'fill', euclid_color.white,
				'border',
					euclid_borderRay.create(
						'ray:append',
						euclid_border.create(
							'distance', 1,
							'width', 2,
							'color', euclid_color.rgb( 255, 188, 87 )
						),
						'ray:append',
						euclid_border.create(
							'color', euclid_color.rgb( 128, 128, 0 )
						)
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
			),
			// hover+focus
			euclid_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', euclid_color.white,
				'border', euclid_color.simpleBlack
			)
		]
	);
			

/*
| The facet of the check icon.
*/
gruga_genericCheckbox.checkIconFacet =
	euclid_facet.create(	
		'fill', euclid_color.black
	);


if( FREEZE )
{
	Object.freeze( gruga_genericCheckbox );
}


})( );
