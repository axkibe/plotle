/*
| Scrollbar
*/


var
	design_facet,
	euclid_border,
	euclid_color,
	gruga_scrollbar;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_scrollbar =
	design_facet.create(
		'fill', euclid_color.rgb( 255, 188, 87 ),
		'border',
			euclid_border.create(
				'color', euclid_color.rgb( 221, 154, 52 )
			)
	);

} )( );
