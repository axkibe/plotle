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
	gleam_shape,
	gleam_border,
	gleam_color,
	gleam_facet,
	gruga_iconNormal,
	euclid_shape_start,
	euclid_shape_line;


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
			euclid_shape_start.create( 'p', ap ), // A
			euclid_shape_line.create( 'p', ap.add(  11,  10 ) ), // B
			euclid_shape_line.create( 'p', ap.add(   6,  11 ) ), // C
			euclid_shape_line.create( 'p', ap.add(   9,  17 ) ), // D
			euclid_shape_line.create( 'p', ap.add(   7,  18 ) ), // E
			euclid_shape_line.create( 'p', ap.add(   4,  12 ) ), // F
			euclid_shape_line.create( 'p', ap.add(   0,  15 ) ), // G
			euclid_shape_line.create( 'close', true )
		],
		'pc', euclid_point.zero
	);


if( FREEZE ) Object.freeze( gruga_iconNormal );


} )( );
