/*
| Highlighting of items
*/


var
	euclid_border,
	euclid_color,
	euclid_facet,
	gruga_highlight;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_highlight =
	// highlight
	euclid_facet.create(
		'group:init', { highlight : true },
		'border',
			euclid_border.create(
				'width', 2,
				'color', euclid_color.rgba( 255, 183, 15, 0.5 ),
				'distance', -2
			)
	);

} )( );
