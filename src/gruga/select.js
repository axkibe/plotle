/*
| The select rectangle.
*/


var
	gleam_border,
	gleam_color,
	gleam_facet,
	gruga_select;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_select = { };


/*
| The frame main facet.
*/
gruga_select.facet =
	gleam_facet.create(
		'border',
			gleam_border.create(
				'color', gleam_color.rgba( 255, 215, 114, 0.9 ),
				'width', 2
			)
	);


if( FREEZE ) Object.freeze( gruga_select );


} )( );
