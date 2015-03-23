/*
| Default label.
*/


var
	design_facet,
	design_facetRay,
	euclid_border,
	euclid_color,
	gruga_label;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_label =
	design_facetRay.create(
		'ray:append',
		// default
		design_facet.create(
			'border',
				euclid_border.create(
					'color', euclid_color.rgba( 100, 100, 0, 0.1 )
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
