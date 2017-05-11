/*
| The zoom in icon.
|
|
|   **********
|   **********
|
*/


var
	gleam_point,
	gleam_shape_line,
	gleam_shape_start,
	gleam_border,
	gleam_color,
	gleam_facet,
	gruga_iconZoomOut,
	gleam_shape;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	c;

gruga_iconZoomOut = { };


gruga_iconZoomOut.facet =
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


c = gleam_point.zero;

gruga_iconZoomOut.shape =
	gleam_shape.create(
		'ray:init',
		[
			gleam_shape_start.p( c.add( -7, -1 ) ),
			gleam_shape_line.p(  c.add(  7, -1 ) ),
			gleam_shape_line.p(  c.add(  7,  1 ) ),
			gleam_shape_line.p(  c.add( -7,  1 ) ),
			gleam_shape_line.close( )
		],
		'pc', c
	);


if( FREEZE ) Object.freeze( gruga_iconZoomOut );


} )( );
