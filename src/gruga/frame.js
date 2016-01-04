/*
| The alteration frame.
*/


var
	euclid_border,
	euclid_color,
	euclid_facet,
	gruga_frame;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_frame = { };


/*
| The scrollbar facet.
*/
gruga_frame.facet =
	euclid_facet.create(
		'fill',
			euclid_color.rgba( 255, 250, 187, 0.8 ),
		'border',
			euclid_border.create(
				'color', euclid_color.rgba( 255, 172, 97, 0.8 )
			)
	);


/*
| The frames inner distance to its items.
*/
gruga_frame.distance = 0;


/*
| The frames width. 
*/
gruga_frame.width = 18;


if( FREEZE ) Object.freeze( gruga_frame );


} )( );
