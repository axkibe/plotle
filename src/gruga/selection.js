/*
| Selection.
*/


var
	gleam_border,
	gleam_color,
	gleam_facet,
	gruga_selection;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_selection =
	gleam_facet.create(
		'fill', gleam_color.rgba( 243, 203, 255, 0.9 ),
		'border', gleam_border.simpleBlack
	);


if( FREEZE ) Object.freeze( gruga_selection );


} )( );
