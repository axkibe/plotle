/*
| Highlighting of items
*/


var
	gleam_border,
	gleam_color,
	gleam_facet,
	gruga_highlight;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_highlight =
	// highlight
	gleam_facet.create(
		'group:init', { highlight : true },
		'border',
			gleam_border.create(
				'width', 2,
				'color', gleam_color.rgba( 255, 183, 15, 0.5 ),
				'distance', -2
			)
	);

} )( );
