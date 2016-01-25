/*
| Default label.
*/


var
	euclid_border,
	gleam_color,
	gleam_facet,
	gleam_facetRay,
	euclid_margin,
	gruga_highlight,
	gruga_label;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_label = { };


gruga_label.facets =
	gleam_facetRay.create(
		'ray:append',
		// default
		gleam_facet.create(
			'border',
				euclid_border.create(
					'color', gleam_color.rgba( 100, 100, 0, 0.1 )
				)
		),
		'ray:append', gruga_highlight
	);


gruga_label.defaultFontsize = 13;


gruga_label.innerMargin =
	euclid_margin.create( 'n', 1, 'e', 1, 's', 1, 'w', 1 );


gruga_label.minSize = 8;


} )( );
