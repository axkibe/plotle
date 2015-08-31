/*
| Default label.
*/


var
	design_facet,
	design_facetRay,
	euclid_border,
	euclid_color,
	euclid_margin,
	gruga_label;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_label = { };


gruga_label.facets =
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


gruga_label.defaultFontsize = 13;


gruga_label.innerMargin =
	euclid_margin.create( 'n', 1, 'e', 1, 's', 1, 'w', 1 );

gruga_label.minSize = 8;

} )( );
