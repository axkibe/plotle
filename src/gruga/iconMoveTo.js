/*
| The "moveTo" icon.
|
|        A (ap)
|       ***
|      *****
|     *******
|    G*F***C*B
|      *****
|      *****
|      *****
|      E***D
|
|      H***I
|      K***J
*/


var
	arrow,
	base1,
	base2,
	gruga_iconMoveTo,
	euclid_point,
	euclid_rect,
	euclid_shape,
	euclid_shape_start,
	euclid_shape_line,
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_shapeRay;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	ap;

ap =
	euclid_point.create(
		'x', 0,
		'y', -11
	);


gruga_iconMoveTo = { };


gruga_iconMoveTo.facet =
	gleam_facet.create(
		'fill', gleam_color.rgb( 107, 91, 73 ),
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


arrow =
	euclid_shape.create(
		'ray:init',
		[
			euclid_shape_start.create( 'p', ap ), // A
			euclid_shape_line.create( 'p', ap.add(   6,   8 ) ), // B
			euclid_shape_line.create( 'p', ap.add(   2,   8 ) ), // C
			euclid_shape_line.create( 'p', ap.add(   2,  14 ) ), // D
			euclid_shape_line.create( 'p', ap.add(  -2,  14 ) ), // E
			euclid_shape_line.create( 'p', ap.add(  -2,   8 ) ), // F
			euclid_shape_line.create( 'p', ap.add(  -6,   8 ) ), // G
			euclid_shape_line.create( 'close', true )
		],
		'pc', ap.add( 0, 7 )
	);


base1 =
	euclid_rect.create(
		'pnw', ap.add( -2, 16 ),
		'pse', ap.add( +2, 17 )
	);


base2 =
	euclid_rect.create(
		'pnw', ap.add( -2, 19 ),
		'pse', ap.add( +2, 20 )
	);


gruga_iconMoveTo.shape =
	gleam_shapeRay.create(
		'ray:init',
		[
			arrow,
			base1,
			base2
		]
	);


if( FREEZE ) Object.freeze( gruga_iconMoveTo );


} )( );
