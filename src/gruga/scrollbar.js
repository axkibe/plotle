/*
| Scrollbar
*/


var
	euclid_border,
	gleam_color,
	gleam_facet,
	gruga_scrollbar;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_scrollbar = { };


/*
| The scrollbar facet.
*/
gruga_scrollbar.facet =
	gleam_facet.create(
		'fill', gleam_color.rgb( 255, 188, 87 ),
		'border',
			euclid_border.create(
				'color', gleam_color.rgb( 221, 154, 52 )
			)
	);

/*
| Width of the scrollbar
*/
gruga_scrollbar.strength = 8;

/*
| Ellipse cap.
*/
gruga_scrollbar.ellipseA = 4;

gruga_scrollbar.ellipseB = 4;

/*
| Minimum height.
*/
gruga_scrollbar.minHeight = 12;


if( FREEZE ) Object.freeze( gruga_scrollbar );


} )( );
