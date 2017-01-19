/*
| The "normal" icon.
|
|
|     A
|     **
|     ***
|     ****
|     *****
|     ******
|     *******
|     **F**C*B
|     G   **
|          **
|           ED
|
*/


var
	euclid_point,
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_shape,
	gleam_shape_line,
	gleam_shape_start,
	gruga_iconNormal;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	ap;

ap =
	euclid_point.create(
		'x', -4,
		'y', -9
	);


gruga_iconNormal = { };


gruga_iconNormal.facet =
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


gruga_iconNormal.shape =
	gleam_shape.create(
		'ray:init',
		[
			gleam_shape_start.create( 'p', ap ), // A
			gleam_shape_line.create( 'p', ap.add(  11,  10 ) ), // B
			gleam_shape_line.create( 'p', ap.add(   6,  11 ) ), // C
			gleam_shape_line.create( 'p', ap.add(   9,  17 ) ), // D
			gleam_shape_line.create( 'p', ap.add(   7,  18 ) ), // E
			gleam_shape_line.create( 'p', ap.add(   4,  12 ) ), // F
			gleam_shape_line.create( 'p', ap.add(   0,  15 ) ), // G
			gleam_shape_line.create( 'close', true )
		],
		'pc', euclid_point.zero
	);


if( FREEZE ) Object.freeze( gruga_iconNormal );


} )( );
