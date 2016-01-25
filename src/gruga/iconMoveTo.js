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
	euclid_anchor_point,
	euclid_anchor_rect,
	euclid_anchor_shape,
	euclid_anchor_shape_start,
	euclid_anchor_shape_line,
	euclid_anchor_shapeRay,
	euclid_border,
	gleam_color,
	gleam_facet;


/*
| Capsule
*/
( function( ) {
'use strict';
	

var
	ap;

// FIXME anchor to center
ap =
	euclid_anchor_point.create(
		'anchor', 'nw',
		'x', 22,
		'y', 11
	);
			

gruga_iconMoveTo = { };


gruga_iconMoveTo.facet =
	gleam_facet.create(
		'fill', gleam_color.rgb( 107, 91, 73 ),
		'border',
			euclid_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


arrow =
	euclid_anchor_shape.create(
		'ray:init',
		[
			euclid_anchor_shape_start.create( 'p', ap ), // A
			euclid_anchor_shape_line.create( 'p', ap.add(   6,   8 ) ), // B
			euclid_anchor_shape_line.create( 'p', ap.add(   2,   8 ) ), // C
			euclid_anchor_shape_line.create( 'p', ap.add(   2,  14 ) ), // D
			euclid_anchor_shape_line.create( 'p', ap.add(  -2,  14 ) ), // E
			euclid_anchor_shape_line.create( 'p', ap.add(  -2,   8 ) ), // F
			euclid_anchor_shape_line.create( 'p', ap.add(  -6,   8 ) ), // G
			euclid_anchor_shape_line.create( 'close', true )
		],
		'pc',
			ap.add( 0, 7 )
	);


base1 =
    euclid_anchor_rect.create(
		'pnw', ap.add( -2, 16 ),
		'pse', ap.add( +2, 17 )
	);


base2 =
	euclid_anchor_rect.create(
		'pnw', ap.add( -2, 19 ),
		'pse', ap.add( +2, 20 )
	);


gruga_iconMoveTo.shape =
	euclid_anchor_shapeRay.create(
		'ray:init',
		[
			arrow,
			base1,
			base2
		]
	);


if( FREEZE ) Object.freeze( gruga_iconMoveTo );


} )( );
