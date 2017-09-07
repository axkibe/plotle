/*
| The zoom in icon.
|
|
|       **
|       **
|   **********
|   **********
|       **
|       **
|
*/


var
	gleam_point,
	gleam_shape_line,
	gleam_shape_start,
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_shape,
	gruga_iconZoomIn;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	c;

gruga_iconZoomIn = { };


gruga_iconZoomIn.facet =
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


c = gleam_point.zero;

gruga_iconZoomIn.shape =
	gleam_shape.create(
		'list:init',
		[
			gleam_shape_start.p( c.add( -1, -7 ) ),
			gleam_shape_line.p(  c.add(  1, -7 ) ),
			gleam_shape_line.p(  c.add(  1, -1 ) ),
			gleam_shape_line.p(  c.add(  7, -1 ) ),
			gleam_shape_line.p(  c.add(  7,  1 ) ),
			gleam_shape_line.p(  c.add(  1,  1 ) ),
			gleam_shape_line.p(  c.add(  1,  7 ) ),
			gleam_shape_line.p(  c.add( -1,  7 ) ),
			gleam_shape_line.p(  c.add( -1,  1 ) ),
			gleam_shape_line.p(  c.add( -7,  1 ) ),
			gleam_shape_line.p(  c.add( -7, -1 ) ),
			gleam_shape_line.p(  c.add( -1, -1 ) ),
			gleam_shape_line.close( )
		],
		'pc', c
	);


if( FREEZE ) Object.freeze( gruga_iconZoomIn );


} )( );
