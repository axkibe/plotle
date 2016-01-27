/*
| Handles
*/


var
	gleam_border,
	gleam_color,
	gleam_facet,
	gruga_handles;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_handles = { };

gruga_handles.facet =
	gleam_facet.create(
		'fill',
			gleam_color.rgba( 255, 240, 150, 0.9 ),
		'border',
			gleam_border.create(
				'color', gleam_color.rgba( 255, 180, 110, 0.9 )
			)
	);


gruga_handles.maxSize = 12;

/*
| FUTURE i got no idea what 'c' and 'e' stands for.
| but this is going to be replaced by frames either way.
*/
gruga_handles.cDistance = 12;

gruga_handles.eDistance = 12;


if( FREEZE )
{
	Object.freeze( gruga_handles );
}

} )( );
