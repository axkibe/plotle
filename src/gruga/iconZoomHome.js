/*
| The zoom home icon.
|
|
|
|  ###    **
|  ###  ******
|  ###*** ** ****
|  ##** ****** ****
| *** ********** ***
|** ************** **
|   **************
|   **************
|   *******   ****
|   *******   ****
|   *******   ****
|   *******   ****
|   *******   ****
*/


var
	gleam_point,
	gleam_shape_line,
	gleam_shape_start,
	gleam_border,
	gleam_color,
	gleam_facet,
	gruga_iconZoomHome,
	gleam_shape,
	gleam_shapeRay;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	c;


gruga_iconZoomHome = { };


gruga_iconZoomHome.facet =
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


c = gleam_point.xy( 0, 2 );


gruga_iconZoomHome.shape =
	gleam_shapeRay.create(
		'list:init',
		[
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.p( c.add( -6,  4 ) ),
					gleam_shape_line.p( c.add(  -6, -2 ) ),
					gleam_shape_line.p( c.add(   0, -9 ) ),
					gleam_shape_line.p( c.add(   6, -2 ) ),
					gleam_shape_line.p( c.add(   6,  4 ) ),

					gleam_shape_line.p( c.add(   2,  4 ) ),
					gleam_shape_line.p( c.add(   2, -4 ) ),
					gleam_shape_line.p( c.add(  -2, -4 ) ),
					gleam_shape_line.p( c.add(  -2,  4 ) ),

					gleam_shape_line.close( )
				],
				'pc', c,
				'nogrid', true
			),
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.p( c.add(  -8,  -3 ) ),
					gleam_shape_line.p( c.add(  -10,  -3 ) ),

					gleam_shape_line.p( c.add(   -7,  -7 ) ),
					gleam_shape_line.p( c.add(   -7, -13 ) ),
					gleam_shape_line.p( c.add(   -4, -13 ) ),
					gleam_shape_line.p( c.add(   -4,  -9 ) ),

					gleam_shape_line.p( c.add(    0, -12 ) ),
					gleam_shape_line.p( c.add(    8,  -3 ) ),
					gleam_shape_line.p( c.add(   10,  -3 ) ),
					gleam_shape_line.p( c.add(    0, -14 ) ),
					gleam_shape_line.close( )
				],
				'pc', c,
				'nogrid', true
			)
		]
	);


if( FREEZE ) Object.freeze( gruga_iconZoomHome );


} )( );


