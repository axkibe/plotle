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
	gruga_iconNormal,
	euclid_anchor_point,
	euclid_anchor_shape,
	euclid_anchor_shape_start,
	euclid_anchor_shape_line,
	gleam_border,
	gleam_color,
	gleam_facet;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	ap;

ap = euclid_anchor_point.c.add( -4, -9 );


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
	euclid_anchor_shape.create(
		'ray:init',
		[
			euclid_anchor_shape_start.create( 'p', ap ), // A
			euclid_anchor_shape_line.create( 'p', ap.add(  11,  10 ) ), // B
			euclid_anchor_shape_line.create( 'p', ap.add(   6,  11 ) ), // C
			euclid_anchor_shape_line.create( 'p', ap.add(   9,  17 ) ), // D
			euclid_anchor_shape_line.create( 'p', ap.add(   7,  18 ) ), // E
			euclid_anchor_shape_line.create( 'p', ap.add(   4,  12 ) ), // F
			euclid_anchor_shape_line.create( 'p', ap.add(   0,  15 ) ), // G
			euclid_anchor_shape_line.create( 'close', true )
		],
		'pc', euclid_anchor_point.c
	);


if( FREEZE ) Object.freeze( gruga_iconNormal );


} )( );