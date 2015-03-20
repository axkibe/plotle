/*
| Default button.
*/


var
	design_facet,
	design_facetRay,
	euclid_border,
	euclid_color,
	gruga_portalInputFacets;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_portalInputFacets =
	design_facetRay.create(
		'ray:init',
		[
			// default state.
			design_facet.create(
				'fill', euclid_color.white,
				'border',
					euclid_border.create(
						'color', euclid_color.rgb( 255, 219, 165 )
					)
			)
		]
	);


})( );
