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
				'width', 3,
				'color', gleam_color.rgba( 255, 170, 0, 0.45 ),
				'distance', -1
			)
	);


if( FREEZE ) Object.freeze( gruga_highlight );


} )( );
