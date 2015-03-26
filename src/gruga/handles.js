/*
| Handles
*/


var
	design_facet,
	euclid_border,
	euclid_color,
	gruga_handles;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_handles =
	design_facet.create(
		'fill',
			euclid_color.rgba( 255, 240, 150, 0.9 ),
		'border',
			euclid_border.create(
				'color', euclid_color.rgba( 255, 180, 110, 0.9 )
			)
	);

} )( );
