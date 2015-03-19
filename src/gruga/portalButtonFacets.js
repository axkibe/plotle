/*
| Facet design of buttons for the moveto form
| and on the portal.
*/


var
	design_facet,
	design_facetRay,
	euclid_border,
	euclid_color,
	gruga_portalButtonFacets;

/*
| Capsule
*/
( function( ) {
'use strict';


gruga_portalButtonFacets =
	design_facetRay.create(
		'ray:init',
		[
			// default state.
			design_facet.create(
				'group:init', { },
				'fill', euclid_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgb( 255, 141, 66 )
					)
			),
			// hover
			design_facet.create(
				'group:init', { 'hover' : true },
				'fill', euclid_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					euclid_border.create(
						'width', 1.5,
						'color', euclid_color.rgb( 255, 141, 66 )
					)
			),
			// focus
			design_facet.create(
				'group:init', { 'focus' : true },
				'fill', euclid_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 1.5,
						'color', euclid_color.rgb( 255, 99, 188 )
					)
			),
			// focus and hover
			design_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', euclid_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 1.5,
						'color', euclid_color.rgb( 255, 99, 188 )
					)
			)
		]
	);


} )( );
